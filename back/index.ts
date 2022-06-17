import * as express from 'express';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import { sequelize } from './models';
import passportConfig from './passport';
import api from './routes/index';

dotenv.config();
const app = express();

const prod: boolean = process.env.NODE_ENV === 'production';
app.set('port', prod ? process.env.PORT : 3000);
passportConfig();   // 인증처리 미들웨어 연동

// 시퀄라이즈 연동
sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공!');
    })
    .catch((err: Error) => {
        console.error(err);
    });

if (prod) {
    app.use(morgan('combined'));
}
else {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
        httpOnly: true,     // true면 http에서만 쿠키 사용. false --> js에서 document.cookie로 접근 가능
        secure: false      // https면 true
    },
    name : 'triple_backend_homework',
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', api);

app.listen(app.get('port'), () => {
    console.log(`server is running on ${app.get('port')}`);
});