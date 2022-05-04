const express = require('express')
const router = express.Router()
const adsController = require('../../controllers/adsController')

 //route post api/cases
router.post('/addAds', adsController.create_ads
)

router.post('/updateAds', adsController.updateAdd
)

router.post('/deleteAd', adsController.delete_ad
)

// route get api/getAllCase
router.get('/getAllAds', adsController.get_all_ads
)

router.get('/getAllAdsByDate', adsController.get_all_ads_by_date
)
// route get api/getCaseById
router.get('/getAdsById', adsController.get_ad_by_id
)

router.get('/getAdsByUser', adsController.get_ad_by_user
)

router.get('/updateAdsStatus', adsController.update_ad_status
)

router.post('/addComment', adsController.add_comment_on_detail
)
module.exports = router
