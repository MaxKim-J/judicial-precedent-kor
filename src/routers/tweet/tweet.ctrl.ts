import { Request, Response, NextFunction } from 'express'
import { OK, CREATED } from 'http-status-codes'
import Tweet from '@/models/entities/tweet'
import TweetModels from '../../models/tweetModels'
import { NotFound, Conflict } from '../../errors'
import validateIdNaN from '../../utils/idValidatingHelper'

const tweetModels:TweetModels = new TweetModels()

const getTweet = async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.query
  try {
    if (id) {
      const tweetId = validateIdNaN(id as string)
      const tweet = await tweetModels.getTweetById(tweetId)
      if (!tweet) { throw new NotFound('id에 해당하는 트윗이 존재하지 않습니다.') }
      return res.status(OK).json({ counts: 1, tweet })
    }
    const tweets:Tweet[] = await tweetModels.getAll()
    const counts = tweets.length
    return res.status(OK).json({ counts, tweets })
  } catch (e) {
    return next(e)
  }
}

const getCurrentTweet = async (req:Request, res:Response, next:NextFunction) => {
  const unuploadedTweets:Tweet[] = await tweetModels.getUnuploadedTweetsAndPrecedent()
  const randomInt = Math.floor(Math.random() * unuploadedTweets.length)
  const tweet = unuploadedTweets[randomInt]
  return res.status(OK).json({ counts: 1, tweet })
}

const getPreviousTweet = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { last } = req.query
    let uploadedTweets:Tweet[] = await tweetModels.getUploadedTweets()
    if (last) {
      const lastNum = validateIdNaN(last as string)
      uploadedTweets = uploadedTweets.slice(0, lastNum)
    }
    const counts = uploadedTweets.length
    return res.status(OK).json({ counts, tweets: uploadedTweets })
  } catch (e) {
    return next(e)
  }
}

const putTimeStampOnTweet = async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params
  try {
    const tweetId = validateIdNaN(id as string)
    const tweetMatchWithId = await tweetModels.getTweetById(tweetId)
    if (!tweetMatchWithId) { throw new NotFound('id에 해당하는 트윗이 존재하지 않습니다.') }
    if (tweetMatchWithId.uploadedAt !== null) { throw new Conflict('이미 업로드된 트윗입니다.') }
    const { raw, affected } = await tweetModels.putTimestampOnTweet(tweetId, new Date())
    return res.status(CREATED).json({ counts: affected, tweet: raw[0] })
  } catch (e) {
    return next(e)
  }
}

export default {
  getTweet,
  getCurrentTweet,
  getPreviousTweet,
  putTimeStampOnTweet,
}
