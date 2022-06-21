import * as express from 'express';
import Review from '../../models/review';
import Place from '../../models/place';
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
        
        // db에 등록할 review 생성
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