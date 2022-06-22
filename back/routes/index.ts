import * as express from 'express';
import userRouter from './user/user';
import reviewRouter from'./review/review';
import placeRouter from './place/place';
import pointRouter from './point/point';

const router = express.Router();

router.use('/user', userRouter);
router.use('/review', reviewRouter);
router.use('/place', placeRouter);
router.use('/point', pointRouter);

export default router;