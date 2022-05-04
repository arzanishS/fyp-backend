const mongoose = require('mongoose')

const CountersSchema = new mongoose.Schema({
  
  sid: {
    type: String,
    unique: true
  },
  seq: {
    type: Number,
    unique: true
  }
})

const Counters = mongoose.model('counters', CountersSchema)
module.exports = Counters
