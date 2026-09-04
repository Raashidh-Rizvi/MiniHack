const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

// Explicit opt-in only. Never reads .env or uses the development database.
test('MongoDB assignment, moderation, history, conflicts and ID allocation', {
  skip: process.env.RUN_MONGO_TESTS !== 'true' || !process.env.MONGO_TEST_URI,
}, async () => {
  const uri = new URL(process.env.MONGO_TEST_URI);
  if (!/^\/gramafix_test(?:_[a-z0-9_-]+)?$/i.test(uri.pathname)) throw new Error('Use a dedicated database named gramafix_test or gramafix_test_<suffix>.');
  process.env.NODE_ENV = 'test';
  process.env.STORAGE_MODE = 'mongo';
  process.env.MONGO_URI = uri.toString();
  const mongoose = require('mongoose');
  const { connectDB } = require('../config/db');
  const { createApp } = require('../app');
  const User = require('../models/User');
  const Issue = require('../models/Issue');
  const { hashPassword } = require('../utils/passwords');
  const createdUsers = []; const createdIssues = []; let server;
  const tag = randomUUID(); const password = randomUUID();
  try {
    await connectDB(); await Promise.all([User.init(), Issue.init()]);
    for (const role of ['ADMIN','CITIZEN','OFFICER']) createdUsers.push(await User.create({ fullName: 'Disposable ' + role, email: role + tag + '@example.test', password: await hashPassword(password), role }));
    server = createApp().listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const base = 'http://127.0.0.1:' + server.address().port + '/api';
    const request = async (method, path, token, data) => {
      const response = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer '+token } : {}) }, body: data === undefined ? undefined : JSON.stringify(data) });
      return { status: response.status, body: await response.json() };
    };
    const admin = (await request('POST','/auth/login',null,{ email: createdUsers[0].email,password })).body.token;
    const citizen = (await request('POST','/auth/login',null,{ email: createdUsers[1].email,password })).body.token;
    const create = async () => {
      const response = await request('POST','/issues',citizen,{title:'Disposable Mongo fixture',description:'Explicit opt-in database integration fixture.',category:'ROAD',location:'Test location',severity:'HIGH',peopleAffected:20});
      assert.equal(response.status,201,JSON.stringify(response.body)); createdIssues.push(response.body.data.id); return response.body.data;
    };
    const issue=await create();
    const assigned=await request('PUT','/admin/issues/'+issue.id+'/assign',admin,{officerId:createdUsers[2].numericId,officerName:'Untrusted',expectedUpdatedAt:issue.updatedAt});
    assert.equal(assigned.status,200); assert.equal(assigned.body.data.assignedOfficerName,createdUsers[2].fullName);
    const updatePath='/admin/issues/'+issue.id+'/status';
    assert.equal((await request('PUT',updatePath,admin,{adminNotes:'stale',expectedUpdatedAt:issue.updatedAt})).status,409);
    const results=await Promise.all(['First writer','Second writer'].map(adminNotes=>request('PUT',updatePath,admin,{adminNotes,expectedUpdatedAt:assigned.body.data.updatedAt})));
    assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
    assert.equal((await request('PUT',updatePath,admin,{newStatus:'DUPLICATE',adminNotes:'Confirmed duplicate'})).status,200);
    const history=await request('GET','/admin/issues/'+issue.id+'/history',admin); assert.equal(history.body.data.length,3);
    assert.equal((await request('GET','/issues/'+issue.id)).body.data.adminHistory,undefined);
    assert.equal((await request('DELETE','/admin/issues/'+issue.id,admin)).status,200);
    const next=await create(); assert.ok(next.id>issue.id);
    assert.equal((await request('PUT','/admin/issues/'+next.id+'/status',admin,{newStatus:'REJECTED',adminNotes:'Test rejection'})).status,200);
  } finally {
    if (server) await new Promise(resolve=>server.close(resolve));
    if (mongoose.connection.readyState === 1) {
      // Only records created by this test run; never drop collections/databases.
      if (createdIssues.length) await Issue.deleteMany({numericId:{$in:createdIssues}});
      if (createdUsers.length) await User.deleteMany({_id:{$in:createdUsers.map(u=>u._id)}});
    }
    await mongoose.disconnect();
  }
});
