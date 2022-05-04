const AWS = require('aws-sdk')
const v4 = require('uuid')
const path = require('path')

// s3 configuration object
const s3 = new AWS.S3({
  accessKeyId: 'AKIA4LZVUQXZ4HSNYNO',
  secretAccessKey: 'aLqNbHUiSoXioOXh9JMWHY7cBCHVEbjboXJypISX'
})

exports.s3Upload = async (image, key, filename = null) => {
  const file = await image
  const stream = file.createReadStream()
  console.log(stream)
  const params = {
    Bucket: childprotection,
    Key: 'cat.png',
    Body: stream,
    ACL: 'public-read'
  }

  return await s3.upload(params).promise()
}

exports.s3DeleteObject = async (key) => {
  await s3.deleteObject({ Bucket: process.env.AWS_BUCKET, Key: key }).promise()
}


