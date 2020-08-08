import request, { Response } from 'supertest'
import express, { Express } from 'express'
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
  body:Precedent,
):Promise<Response> => {
  const res:Response = await (await request(app).post(url).send(body))
  return res
}
