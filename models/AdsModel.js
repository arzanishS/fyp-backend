const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdsSchema = new mongoose.Schema({

  name: {
    type: String,
    unique: false
  },
  item_description: {
    type: String,
    unique: false
  },
  location: {
    type: String,
    unique: false
  },
  status: {
    type: String,
    unique: false,
    default: 'publish'
  },
  item_condition_id: {
    type: Number,
    unique: false
  },
  general_cat: {
    type: String,
    unique: false
  },
  sub1_cat: {
    type: String,
    unique: false
  },
  sub2_cat: {
    type: String,
    unique: false
  },
  brand_name: {
    type: String,
    unique: false
  },
  price: {
    type: Number,
    unique: false
  },
  shipping: {
    type: Number,
    unique: false
  },
  media: [
    {
      file : {
        type: String,
        unique: false
      },
      type : {
        type: String,
        unique: false
      }
    }
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  createdByType: {
    type: String,
    unique: false
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    unique: false
  }

})

const Ads = mongoose.model('ads', AdsSchema)
module.exports = Ads
