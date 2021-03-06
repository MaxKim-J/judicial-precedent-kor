import express from 'express'
import ctrl from './tweet.ctrl'

const router = express.Router()

router.get('/', ctrl.getTweet)
router.get('/current', ctrl.getCurrentTweet)
router.get('/previous', ctrl.getPreviousTweet)
router.put('/:id', ctrl.putTimeStampOnTweet)

export default router
