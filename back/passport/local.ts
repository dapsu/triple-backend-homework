import * as passport from 'passport';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import User from '../models/user';

// Local Strategy 정의
export default () => {
    passport.use('local', new Strategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return done(null, false, { message: '존재하지 않는 사용자입니다!' });
            }
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                return done(null, user);
            }
            return done(null, false, { message: '비밀번호가 틀립니다.' });
        } catch (err) {
            console.error(err);
            return done(err);
        }
    }));
};