import * as express from 'express';
import Review from '../../models/review';
import Place from '../../models/place';
import Point from '../../models/point';
import { isLoggedIn } from '../../middlewares/auth';

const router = express.Router();

// 리뷰 작성
router.post('/events/:placeId', isLoggedIn, async (req, res, next) => {
    try {
        const placeId = req.params.placeId;
        // placeId가 유효하지 않다면 404 반환
        if (!placeId) return res.status(404).end();

        // user 정보
        const user = req.user!;
        const userId = user.dataValues.id;
        
        // 해당 장소에 리뷰 한 개만 등록하도록 설정
        const alreadyReview = await Review.findOne({
            where: { UserId: userId, PlaceId: placeId },
            attributes: ['UserId', 'PlaceId']
        });
        if (alreadyReview !== null) return res.status(403).send('이미 해당 장소에 리뷰를 등록했습니다!');
                
        // db에 등록할 리뷰 생성
        const newReview = await Review.create({
            type: 'REVIEW',
            action: 'ADD',
            content: req.body.content
        });
        const reviewId = newReview.dataValues.id;
        await user.addReview(reviewId);

        const place = await Place.findOne({
            where: { id: placeId },
            attributes: ['id']
        });
        await place!.addReview(reviewId);

        // 리뷰 작성 시 포인트 적립
        await Point.increment({ points: 1 }, { where: {UserId: userId } });     // increment함수: 일치한 모델이 있으면 points값 1 증가

        const placeReviews:any = await Review.findAll({
            where: { PlaceId: placeId }
        });

        if (placeReviews.length === 1) {    // 해당 장소에 첫 리뷰 작성 시 1점 추가
            await Point.increment({ points: 1 }, { where: {UserId: userId } });
        }

        const event = await Review.findOne({
            where: { id: reviewId },
            attributes: ['type', 'action', 'content', 'UserId', 'PlaceId']
        });

        return res.json(event);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;