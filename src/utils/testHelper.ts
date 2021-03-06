import request, { Response } from 'supertest'
import express, { Express } from 'express'
import Precedent from '../models/entities/precedent'
import loaders from '../loaders'

export const loadApp = async ():Promise<Express> => {
  const app:Express = express()
  await loaders(app)
  return app
}

export const mockGetResponse = async (app:Express, url:string):Promise<Response> => {
  const res:Response = await request(app).get(url)
  return res
}

export const mockPostResponse = async (
  app:Express,
  url:string,
  body:Precedent[] | any,
):Promise<Response> => {
  const res:Response = await request(app).post(url).send(body)
  return res
}

export const mockPutResponse = async (
  app:Express,
  url:string,
) => {
  const res:Response = await request(app).put(url)
  return res
}
