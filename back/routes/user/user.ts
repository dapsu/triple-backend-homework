import * as express from 'express';
import * as passport from 'passport';
import * as bcrypt from 'bcrypt';
import User from '../../models/user';
import { isLoggedIn, isNotLoggedIn } from '../../middlewares/auth';

const router = express.Router();

// 사용자 정보 조회
router.get('/', isLoggedIn, (req, res) => {
    const user = req.user!;
    return res.json([user.email, user.userName]);
});

// 회원가입
router.post('/', async (req, res, next) => {
    try {
        const alreadyUser = await User.findOne({
            where : {
                email: req.body.email
            }
        });
        if (alreadyUser) return res.status(403).send('이미 사용 중인 아이디입니다.');

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            email: req.body.email,
            userName: req.body.userName,
            password: hashedPassword
        });
        return res.status(200).json(newUser);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

// 로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err: Error , user: User , info: { message: string }) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (info) return res.status(401).send(info.message);
        
        return req.login(user, async (loginErr: Error) => {
            try {
                if (loginErr) return next(loginErr);
                const fullUser = await User.findOne({
                    where: { email: user.email },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [

                    ]
                });
                return res.json(fullUser);
            }
            catch (err) {
                console.error(err);
                return next(err);
            }
        });
    })(req, res, next);
});

// 로그아웃
router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session!.destroy(() => {
        res.send('logout 성공');
    });
});

export default router;