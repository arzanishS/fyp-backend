const Ads = require('../models/AdsModel')
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );



const uploadsBusinessGallery = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'marketplaceproject',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb( null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
		}
	})
}).array('media');

exports.get_all_ads = async (req, res) => {
  try {
    let ads = []
    const { search, cat } = req.query
    if(search) {
      const regex = { $regex: new RegExp(search.trim().toLowerCase(), 'i') }
      ads = await Ads.find(
        {"name": regex}
      ).populate('createdBy',['name', 'userType']).sort({ creationDate: -1 })
    } else if(cat) {
      ads = await Ads.find(
        {"general_cat": cat}
      ).populate('createdBy',['name', 'userType']).sort({ creationDate: -1 })
    }
    else {
      ads = await Ads.find().populate('createdBy',['name', 'userType']).sort({ creationDate: -1 })
    }
    res.json(ads)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('server error')
  }
}

exports.search_ads = async (req, res) => {
  try {
    const { search } = req.query
    const regex = { $regex: new RegExp(search.trim().toLowerCase(), 'i') }
    const ads = await Ads.find(
      {"name": regex}
    ).populate('createdBy',['name', 'userType']).sort({ creationDate: -1 })
    res.json(ads)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('server error')
  }
}

exports.delete_ad = async (req, res) => {
  try {
    await Ads.findOneAndRemove({ _id: req.query.id })
    res.status(200).json({ msg: 'Add deleted successfully', status: 'success' })
  } catch (error) {
    console.log(error.message)
    res.status(200).json({ msg: 'Server error', status: 'failed' })
  }
}

exports.get_all_ads_by_date = async (req, res) => {
  try {
    const start = new Date(req.query.startDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(req.query.endDate)
    end.setHours(23, 59, 59, 999)
    const ads = await Ads.find({ 
      creationDate: {
        $gte:  start, 
        $lt: end
      }
  }).populate('createdBy',['name', 'userType', 'phone']).sort({ creationDate: -1 })
    res.json(ads)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('server error')
  }
}

exports.get_ad_by_id = async (req, res) => {
  try {
    const ads = await Ads.findById(req.query.id).populate('createdBy')
    if (!ads) {
      return res.status(404).json({ msg: 'ad not found' })
    }
    res.json(ads)
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'ad not found' })
    }
    console.log(error.message)
    res.status(500).send('server error')
  }
}

exports.get_ad_by_user = async (req, res) => {
  try {
    const ads = await Ads.find({ createdBy : req.query.id })
    
    if (!ads) {
      return res.status(404).json({ msg: 'case not found' })
    }
    res.status(200).json(ads)
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'case not found' })
    }
    console.log(error.message)
    res.status(500).send('server error')
  }
}

exports.updateAdd = async (req, res) => {
  try {
    const filter = { _id: req.body._id }
    const updateData = req.body
    delete updateData._id
    const ads = await Ads.findOneAndUpdate(filter, updateData, { new: true })
    res.json({ ads, status: true })
  } catch (error) {
    console.log(error.message)
    res.status(500).send('server error')
  }
}


exports.update_ad_status = async (req, res) => {
  try {
    const ads = await Ads.findById(req.query.id)
    if (!ads) {
      return res.status(404).json({ msg: 'post not found' })
    }
    ads.status = req.query.status
    await ads.save()
    res.json({status: 'success', ads})
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found' })
    }
    console.log(error.message)
    res.status(500).send('server error')
  }
}

exports.add_comment_on_detail = async (req, res) => {
  try {
    const { _id , comments } = req.body
    console.log(req.body)
    const ads = await Ads.findById(_id)
    if (!ads) {
      return res.status(404).json({ msg: 'case not found' })
    }
    ads.comments = comments.trim()
    await ads.save()
    res.json({status: 'success', ads})
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'case not found' })
    }
    console.log(error.message)
    res.status(500).send('server error')
  }
}

exports.create_ads = async (req, res) => {
  
  try{
    uploadsBusinessGallery( req, res, ( error ) => {
    const dataBody = req.body
    delete dataBody.media
		if( error ){
			console.log( 'errors', error );
			res.json( { error: error } );
		} else {
			// If File not found
			if( req.files === undefined ){
				console.log( 'Error: No File Selected!' );
				res.json( 'Error: No File Selected' );
			} else {
				// If Success
				let fileArray = req.files
				const evidence_data = [];
				for ( let i = 0; i < fileArray.length; i++ ) {
					let file = fileArray[ i ].location;
          let type = fileArray[ i ].mimetype.substring(0, fileArray[ i ].mimetype.lastIndexOf('/'));
					evidence_data.push({ file, type})
				}
				// Save the file name into database
			  dataBody.media = evidence_data 
        let ads = new Ads(dataBody)
        ads.save()
        res.json({ status: 'success', data: ads })
			}
		}
	})

  } catch (error) {
    console.log(error.message)
    res.status(500).send('Server error')
  }
}




