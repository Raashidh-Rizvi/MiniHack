const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
process.env.NODE_ENV = 'test';
process.env.STORAGE_MODE = 'memory';
const { connectDB } = require('../config/db');
const { createApp } = require('../app');
const memory = require('../models/memoryStore');
const sessions = require('../services/sessions');
const { hashPassword, verifyPassword } = require('../utils/passwords');
const { calculatePriority } = require('../utils/priorityCalculator');
let server, base, admin, citizen, officer, otherOfficer;
async function request(method, path, token, data) {
  const res = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: data === undefined ? undefined : JSON.stringify(data) });
  return { status: res.status, body: await res.json() };
}
async function login(email, password) {
  const result = await request('POST', '/auth/login', null, { email, password });
  assert.equal(result.status, 200, JSON.stringify(result.body)); return result.body.token;
}
const report = { title: 'Test road report [A]', description: 'A disposable road report for integration checks.', category: 'ROAD', location: 'Test location', severity: 'HIGH', peopleAffected: 20 };
async function create() {
  const result = await request('POST', '/issues', citizen, report); assert.equal(result.status, 201); return result.body.data;
}
before(async () => {
  await connectDB();
  server = createApp().listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = 'http://127.0.0.1:' + server.address().port + '/api';
  admin = await login('admin.priyantha@gramafix.lk', 'admin123');
  citizen = await login('kasun.citizen@gramafix.lk', 'password123');
  officer = await login('officer.bandara@gramafix.lk', 'officer123');
  const second = memory.createUser({ fullName: 'Test Officer Two', email: 'test-officer@example.test', password: await hashPassword('test-only-password'), role: 'OFFICER' });
  otherOfficer = { id: second.id, token: await login(second.email, 'test-only-password') };
});
after(async () => { await new Promise(resolve => server.close(resolve)); });

test('sessions are issued, expiring, role-bound and revocable; legacy password upgrades', async () => {
  assert.equal((await request('GET', '/admin/queue')).status, 401);
  assert.equal((await request('GET', '/admin/queue', 'a'.repeat(64))).status, 401);
  for (const token of [citizen, officer]) {
    for (const [method, path, data] of [['GET','/admin/stats'], ['GET','/admin/queue'], ['GET','/officer/list'], ['GET','/admin/issues/101/history'], ['PUT','/admin/issues/101/status',{newStatus:'UNDER_REVIEW'}], ['PUT','/admin/issues/101/assign',{officerId:2}], ['PATCH','/admin/issues/101/priority',{}], ['DELETE','/admin/issues/101']]) {
      assert.equal((await request(method,path,token,data)).status,403, path);
    }
  }
  const saved = memory.findUserById(3);
  assert.ok(saved.password.startsWith('scrypt:')); assert.ok(await verifyPassword('admin123', saved.password));
  const me = await request('GET','/auth/me',admin); assert.equal(me.body.data.role,'ADMIN'); assert.equal(me.body.data.password,undefined);
  assert.equal((await request('POST','/auth/login',null,{email:saved.email,password:'wrong'})).status,401);
  const expired = sessions.issue(saved, Date.now() - 9*60*60*1000);
  assert.equal((await request('GET','/auth/me',expired)).status,401);
  const transient = await login(saved.email,'admin123');
  assert.equal((await request('POST','/auth/logout',transient,{})).status,200);
  assert.equal((await request('GET','/auth/me',transient)).status,401);
});
test('merged citizen statistics, field errors and support use authenticated identity', async () => {
  assert.equal((await request('GET', '/issues/my-stats')).status, 401);
  assert.equal((await request('GET', '/issues/my-stats', officer)).status, 403);
  const reports = await request('GET', '/issues/my-reports', citizen);
  const stats = await request('GET', '/issues/my-stats?userId=999', citizen);
  assert.equal(stats.body.data.total, reports.body.data.length);
  const invalid = await request('POST', '/issues', citizen, { ...report, title: 'x' });
  assert.equal(invalid.status, 400);
  assert.ok(invalid.body.errors.some(e => e.field === 'title'));
  const issue = await create();
  const path = '/issues/' + issue.id + '/support';
  assert.equal((await request('POST', path, null, { userId: 1 })).status, 401);
  assert.equal((await request('POST', path, officer, {})).status, 403);
  assert.equal((await request('POST', path, citizen, { userId: 999 })).body.supportCount, 1);
  assert.equal((await request('POST', path, citizen, {})).body.supportCount, 1);
  assert.equal((await request('GET', '/issues/' + issue.id)).body.data.supportedBy, undefined);
  assert.equal((await request('DELETE', path, citizen)).body.supportCount, 0);
  assert.equal((await request('DELETE', path, citizen)).body.supportCount, 0);
  assert.equal((await request('DELETE', '/issues/' + issue.id, citizen)).status, 200);
});

test('public registration cannot grant privileged roles', async () => {
  for (const role of ['ADMIN','OFFICER','SYSTEM_ADMIN']) assert.equal((await request('POST','/auth/register',null,{fullName:'Test User',email:role+'@example.test',password:'test-password',role})).status,403);
  const created = await request('POST','/auth/register',null,{fullName:'Test Citizen',email:'new@example.test',password:'test-password',role:'CITIZEN'});
  assert.equal(created.status,201); assert.equal(created.body.data.role,'CITIZEN'); assert.equal(created.body.data.password,undefined);
  assert.equal((await request('POST','/auth/register',null,{fullName:'Test Citizen',email:'new@example.test',password:'test-password'})).status,409);
});
test('report -> admin assignment -> officer resolution uses the same records and private notes', async () => {
  const issue = await create();
  assert.equal((await request('PUT','/issues/'+issue.id,officer,{title:'Not allowed'})).status,403);
  const update = await request('PUT','/admin/issues/'+issue.id+'/status',admin,{newStatus:'UNDER_REVIEW',adminNotes:'Internal coordination',expectedUpdatedAt:issue.updatedAt});
  assert.equal(update.status,200);
  const stale = await request('PUT','/admin/issues/'+issue.id+'/status',admin,{adminNotes:'stale',expectedUpdatedAt:issue.updatedAt}); assert.equal(stale.status,409);
  for (const officerId of [1,99999,null,{},[]]) assert.equal((await request('PUT','/admin/issues/'+issue.id+'/assign',admin,{officerId})).status,400);
  const assigned = await request('PUT','/admin/issues/'+issue.id+'/assign',admin,{officerId:otherOfficer.id,officerName:'Forged name',expectedUpdatedAt:update.body.data.updatedAt});
  assert.equal(assigned.status,200); assert.equal(assigned.body.data.assignedOfficerName,'Test Officer Two');
  assert.equal((await request('GET','/officer/queue?officerId='+otherOfficer.id,officer)).body.data.some(i=>i.id===issue.id),false);
  assert.equal((await request('PUT','/officer/issues/'+issue.id+'/status',officer,{newStatus:'IN_PROGRESS',officerId:otherOfficer.id})).status,403);
  assert.equal((await request('PUT','/officer/issues/'+issue.id+'/status',otherOfficer.token,{newStatus:'RESOLVED'})).status,409);
  assert.equal((await request('PUT','/officer/issues/'+issue.id+'/status',otherOfficer.token,{newStatus:'IN_PROGRESS',fieldNotes:'Crew started'})).status,200);
  assert.equal(memory.getIssueById(issue.id).adminNotes,'Internal coordination');
  assert.equal((await request('PUT','/officer/issues/'+issue.id+'/status',otherOfficer.token,{newStatus:'RESOLVED',fieldNotes:'Work complete'})).status,200);
  const publicResult = await request('GET','/issues/'+issue.id);
  assert.equal(publicResult.body.data.status,'RESOLVED'); assert.equal(publicResult.body.data.adminNotes,undefined); assert.equal(publicResult.body.data.adminHistory,undefined);
  const own = await request('GET','/issues/my-reports?userId=999',citizen); assert.ok(own.body.data.some(i=>i.id===issue.id));
  assert.equal((await request('PUT','/issues/'+issue.id,citizen,{title:'Changed report'})).status,409);
  assert.equal((await request('DELETE','/issues/'+issue.id,citizen)).status,409);
  const history = await request('GET','/admin/issues/'+issue.id+'/history',admin);
  assert.equal(history.body.data.length,2); assert.equal(history.body.data[0].actorId,3);
});
test('moderation, metadata-only changes, history, input validation, field allowlist and deletion', async () => {
  const issue = await create();
  const id=issue.id; const endpoint='/admin/issues/'+id;
  for (const bad of [null,{},[],42,'INVALID']) {
    assert.equal((await request('PUT',endpoint+'/status',admin,{newStatus:bad})).status,400);
    assert.equal((await request('PUT',endpoint+'/status',admin,{adjustedSeverity:bad})).status,400);
  }
  assert.equal((await request('PUT',endpoint+'/status',admin,{adminNotes:'x'.repeat(501)})).status,400);
  assert.equal((await request('PUT',endpoint+'/status',admin,{newStatus:'REJECTED'})).status,400);
  assert.equal((await request('PUT',endpoint+'/status',admin,{adjustedSeverity:'CRITICAL'})).status,400);
  const changed = await request('PUT',endpoint+'/status',admin,{adjustedSeverity:'CRITICAL',adminNotes:'Severe impact'}); assert.equal(changed.status,200);
  assert.equal((await request('PUT',endpoint+'/status',admin,{adminNotes:''})).status,200);
  const count = memory.getIssueById(id).adminHistory.length;
  await request('PUT',endpoint+'/status',admin,{adminNotes:''}); assert.equal(memory.getIssueById(id).adminHistory.length,count);
  const ownUpdate = await request('PUT','/issues/'+id,citizen,{title:'Legitimate title update',status:'RESOLVED',assignedOfficer:999,adminNotes:'injected',priorityScore:0});
  assert.equal(ownUpdate.status,200); assert.equal(memory.getIssueById(id).status,'REPORTED'); assert.equal(memory.getIssueById(id).assignedOfficer,2); assert.equal(memory.getIssueById(id).adminNotes,'');
  const separateCitizen = (await request('POST','/auth/register',null,{fullName:'Another Citizen',email:'another@example.test',password:'test-password'})).body.token;
  assert.equal((await request('PUT','/issues/'+id,separateCitizen,{title:'Unauthorized edit'})).status,403);
  assert.equal((await request('DELETE','/issues/'+id,separateCitizen)).status,403);
  assert.equal((await request('PATCH',endpoint+'/priority',admin,{})).status,200);
  assert.equal((await request('PUT',endpoint+'/status',admin,{newStatus:'DUPLICATE',adminNotes:'Already reported'})).status,200);
  assert.equal((await request('PATCH',endpoint+'/priority',admin,{})).status,409);
  assert.equal((await request('PUT',endpoint+'/status',admin,{newStatus:'REPORTED'})).status,409);
  assert.equal((await request('PUT',endpoint+'/status',admin,{adminNotes:'Closed note'})).status,200);
  assert.equal((await request('DELETE','/issues/'+id,citizen)).status,409);
  assert.equal((await request('DELETE',endpoint,admin)).status,200);
  assert.equal((await request('DELETE',endpoint,admin)).status,404);
  assert.ok((await create()).id > id);
  const rejected = await create(); assert.equal((await request('PUT','/admin/issues/'+rejected.id+'/status',admin,{newStatus:'REJECTED',adminNotes:'Outside scope'})).status,200);
});
test('literal combined search and global statistics', async () => {
  const issue = await create();
  const result = await request('GET','/admin/queue?search=%5BA%5D&category=ROAD&status=REPORTED&priorityLevel='+issue.priorityLevel,admin);
  assert.equal(result.status,200); assert.ok(result.body.data.some(i=>i.id===issue.id));
  const noMatch = await request('GET','/admin/queue?search=.%2A',admin); assert.equal(noMatch.body.data.length,0);
  assert.equal((await request('GET','/admin/queue?search='+ 'x'.repeat(101),admin)).status,400);
  const list = memory.getAllIssues(); const actual = (await request('GET','/admin/stats',admin)).body.data;
  assert.deepEqual(actual,{totalIssues:list.length,openIssues:list.filter(i=>['REPORTED','UNDER_REVIEW'].includes(i.status)).length,inProgressIssues:list.filter(i=>i.status==='IN_PROGRESS').length,resolvedIssues:list.filter(i=>i.status==='RESOLVED').length,criticalIssues:list.filter(i=>i.priorityLevel==='CRITICAL').length});
});
test('scoring keeps normalized boundaries and creation/recalculation consistent', () => {
  const now = Date.UTC(2026,8,4);
  assert.deepEqual(calculatePriority('HIGH',20,null,now,now),{priorityScore:60,priorityLevel:'MEDIUM'});
  assert.deepEqual(calculatePriority('CRITICAL',301,null,now-73*3600000,now),{priorityScore:99,priorityLevel:'CRITICAL'});
  for (const population of [10,11,50,51,150,151,300,301]) {
    for (const hours of [0,6,6.01,24,24.01,48,48.01,72,72.01]) {
      const score=calculatePriority('MEDIUM',population,null,now-hours*3600000,now);
      assert.ok(score.priorityScore>=0 && score.priorityScore<=100);
    }
  }
});

test('frontend priority preview matches backend at impact/age boundaries', () => {
  const fs = require('node:fs');
  const ts = require('../../client/node_modules/typescript');
  const vm = require('node:vm');
  const source = fs.readFileSync(require('node:path').join(__dirname, '../../client/src/utils/priority.ts'), 'utf8');
  const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const scope = { exports: {} }; vm.runInNewContext(javascript, scope);
  const now = Date.UTC(2026,8,4);
  for (const severity of ['LOW','MEDIUM','HIGH','CRITICAL']) for (const population of [1,10,11,50,51,150,151,300,301]) for (const hours of [0,6,6.01,24,24.01,48,48.01,72,72.01]) {
    const preview = scope.exports.calculatePriorityScore(severity,population,hours);
    const saved = calculatePriority(severity,population,null,now-hours*3600000,now);
    assert.equal(preview.score,saved.priorityScore); assert.equal(preview.level,saved.priorityLevel);
  }
});
test('all transition-policy combinations and Mongoose moderation enums', async () => {
  const policy = require('../services/issuePolicy');
  const Issue = require('../models/Issue');
  const allowed = { REPORTED:['UNDER_REVIEW','DUPLICATE','REJECTED'], UNDER_REVIEW:['IN_PROGRESS','REPORTED','DUPLICATE','REJECTED'], IN_PROGRESS:['RESOLVED','UNDER_REVIEW'] };
  const officerAllowed = { REPORTED:['UNDER_REVIEW'], UNDER_REVIEW:['IN_PROGRESS'], IN_PROGRESS:['RESOLVED'] };
  for (const status of policy.statuses) for (const next of policy.statuses) for (const officerMode of [false,true]) {
    const valid = status === next || (officerMode ? officerAllowed : allowed)[status]?.includes(next);
    if (valid) assert.doesNotThrow(()=>policy.checkTransition({status},next,officerMode));
    else assert.throws(()=>policy.checkTransition({status},next,officerMode),{statusCode:409});
  }
  for (const status of ['DUPLICATE','REJECTED']) await new Issue({...report,numericId:999,status}).validate();
});
