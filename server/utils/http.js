const fail = (statusCode, message) => Object.assign(new Error(message), { statusCode });
const handle = (fn) => (req, res, next) => Promise.resolve().then(() => fn(req, res)).catch(next);
const body = (req) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) throw fail(400, 'A JSON object is required.');
  return req.body;
};
module.exports = { fail, handle, body };
