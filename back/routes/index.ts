import * as express from 'express';
import userRouter from './user/user';

const router = express.Router();

router.use('/user', userRouter);

export default router;