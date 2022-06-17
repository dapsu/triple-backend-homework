import * as dotenv from 'dotenv';
dotenv.config();

// 객체 config에 대한 타입 정의
type Config = {
  username: string,
  password: string,
  database: string,
  host: string,
  [key: string]: string,
}
interface IConfigGroup {  // 인터페이스 네임 앞에 I 붙이는 방식은 타입스크립트에서 자주 사용된다고 함
  development: Config;
  test: Config;
  production: Config;
}

const config: IConfigGroup = {
  "development": {
    "username": process.env.DB_USER!,
    "password": process.env.DB_PASSWORD!,
    "database": process.env.DB_DATABASE!,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.DB_USER!,
    "password": process.env.DB_PASSWORD!,
    "database": process.env.DB_DATABASE!,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USER!,
    "password": process.env.DB_PASSWORD!,
    "database": process.env.DB_DATABASE!,
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

export default config;