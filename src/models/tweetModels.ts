import { DeepPartial, UpdateResult } from 'typeorm'
import Tweet from '../models/entities/tweet'

class TweetModel {
  getAll():Promise<Tweet[]> {
    return Tweet.find()
  }

  getTweetById(id:number):Promise<Tweet | undefined> {
    return Tweet.createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.precedent', 'precedent')
      .where('tweet.id = :id', { id })
      .select(['tweet', 'precedent.id'])
      .getOne()
  }

  getUploadedTweets():Promise<Tweet[]> {
    return Tweet.createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.precedent', 'precedent')
      .select(['tweet', 'precedent.name', 'precedent.type'])
      .where('tweet.uploadedAt IS NOT NULL')
      .orderBy('tweet.uploadedAt', 'DESC')
      .getMany()
  }

  getUnuploadedTweetsAndPrecedent():Promise<Tweet[]> {
    return Tweet.createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.precedent', 'precedent')
      .select(['tweet', 'precedent.name', 'precedent.url', 'precedent.id'])
      .where('tweet.uploadedAt IS NULL')
      .getMany()
  }

  putTimestampOnTweet(id:number, uploadedAt:Date):Promise<UpdateResult> {
    return Tweet.createQueryBuilder('tweet')
      .update(Tweet, { uploadedAt })
      .where('tweet.id = :id', { id })
      .returning(['id', 'content', 'uploadedAt'])
      .execute()
  }

  async createTweet(tweet:DeepPartial<Tweet>):Promise<Mutation<Tweet>> {
    try {
      const result = await Tweet.create(tweet).save()
      return {
        success: true,
        result,
      }
    } catch (e) {
      return {
        success: false,
        error: e,
      }
    }
  }
}

export default TweetModel
