import * as passport from 'passport';
import User from '../models/user';
import local from './local';

// passport 미들웨어: 로그인 인증 기능 구현
export default () => {
    passport.serializeUser((user, done) => {      // 로그인할 때 한 번 실행됨
        done(null, user.id);    // user의 id 정보를 메모리에 저장(user로 저장하면 용량 크기 때문)
    });

    passport.deserializeUser<number>(async(id, done) => {    // 요청 받으면 호출되어 사용자 정보 불러옴
        try {
            const user = await User.findOne({
                where: { id },
            });
            if (!user) {
                return done(new Error('No user!'));
            }
            return done(null, user);    // req.user
        } catch (err) {
            console.error(err);
            return done(err);
        }
    });

    local();
}