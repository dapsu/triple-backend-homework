import * as express from 'express';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import { sequelize } from './models';

const app = express();

const prod: boolean = process.env.NODE_ENV === 'production';
app.set('port', prod ? process.env.PORT : 3000);

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

app.get('/', (req, res) => {
    res.send('백엔드 정상 동작!').status(200).end();
});

app.listen(app.get('port'), () => {
    console.log(`server is running on ${app.get('port')}`);
});