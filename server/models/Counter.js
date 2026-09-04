const mongoose = require('mongoose');
const counterSchema = new mongoose.Schema({ _id: String, value: Number });
const Counter = mongoose.model('Counter', counterSchema);
async function nextId(name, Model, minimum = 0) {
  const last = await Model.findOne({ numericId: { $exists: true } }).sort({ numericId: -1 }).select('numericId');
  const floor = Math.max(minimum, last?.numericId || 0);
  try { await Counter.updateOne({ _id: name }, { $max: { value: floor } }, { upsert: true }); }
  catch (error) { if (error.code !== 11000) throw error; await Counter.updateOne({ _id: name }, { $max: { value: floor } }); }
  const result = await Counter.findOneAndUpdate({ _id: name }, { $inc: { value: 1 } }, { new: true });
  return result.value;
}
module.exports = { nextId };
