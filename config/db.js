const mongoose = require('mongoose')
const config = require('config')
const db = 'mongodb+srv://arzanishs:project01@cluster0.wwpcw.mongodb.net/marketplace?retryWrites=true&w=majority'

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    })
    mongoose.set('useFindAndModify', false)
    console.log('Mongodb connected')
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}

module.exports = connectDB
