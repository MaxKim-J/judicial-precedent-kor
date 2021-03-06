import { createConnection } from 'typeorm'
import configs from '../configs'

const dbLoader = () => createConnection({
  type: 'postgres',
  host: 'localhost',
  port: configs.DB.PORT,
  username: configs.DB.USER,
  password: configs.DB.PASSWORD,
  database: configs.DB.NAME,
  synchronize: configs.ENV === 'dev',
  entities: ['src/models/entities/**/*.ts'],
})

export default dbLoader
