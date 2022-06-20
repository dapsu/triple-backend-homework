import * as express from 'express';
import userRouter from './user/user';
import reviewRouter from'./review/review';
import placeRouter from './place/place';

const router = express.Router();

router.use('/user', userRouter);
router.use('/review', reviewRouter);
router.use('/place', placeRouter);

export default router;