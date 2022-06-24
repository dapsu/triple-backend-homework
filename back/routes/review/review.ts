import * as express from 'express';
import * as fs from 'fs';
import Review from '../../models/review';
import Place from '../../models/place';
import Point from '../../models/point';
import PointLog from '../../models/pointLog';
import ReviewImage from '../../models/reviewImage';
import { isLoggedIn } from '../../middlewares/auth';
import { uploadFile } from '../../middlewares/upload';

const router = express.Router();

// action 타입
const actionType = {
    ADD: 'ADD',
    MOD: 'MOD',
    DELETE: 'DELETE'
};

//로그 업데이트 타입
const updatePointType = {
    create: '리뷰 작성 점수: +1',
    img: '리뷰 사진 등록 점수: +1',
    getBonus: '특정 장소에 첫 리뷰 작성: +1',
    modifiy: '리뷰 내용 수정: 0',
    delete: '리뷰 삭제: -1',
    deleteImg: '리뷰 이미지 삭제: -1',
    deleteBonus: '보너스 포인트 삭제: -1'
}

// 리뷰 이미지 업로드
router.post('/img/:reviewId', isLoggedIn, uploadFile.single('file'), async (req, res, next) => {
    try {
        const user = req.user!;
        const userId = user.dataValues.id;

        const reviewId = req.params.reviewId;
        // reviewId가 유효하지 않다면 404 반환
        if (!reviewId) return res.status(404).end();

        const review = await Review.findOne({
            where: { id: reviewId },
            attributes: ['id', 'UserId']
        });
        if (review!.dataValues.UserId !== userId) return res.status(403).end();     // 다른 사용자가 작성한 리뷰에 접근하려고 할 때
        
        const newImage = await ReviewImage.create({
            type: req.file!.mimetype,
            imageName: req.file!.originalname,
            data: fs.readFileSync(__dirname + '/../../public/images/' + req.file!.filename)    // 해당 경로로부터 파일 불러옴
        });
        const reviewImageId = newImage.dataValues.id;
        await review!.addReviewImage(reviewImageId);

        // 사진 등록 시 포인트 적립
        const Images = await ReviewImage.findAll({
            where: { ReviewId: reviewId }
        });
        if (Images.length === 1) {
            await Point.increment({ points: 1 }, { where: { UserId: userId } });
            // 포인트 적립 로그 생성
            const newImageLog = await PointLog.create({
                action: actionType.ADD,
                reviewId: reviewId,
                updatePoint: updatePointType.img,
            });
            const imageLogId = newImageLog.dataValues.id;
            await user.addPointLog(imageLogId);
        }
        
        return res.send('사진 등록 완료!');
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

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
        const newReview:Review = await Review.create({
            type: 'REVIEW',
            action: actionType.ADD,
            content: req.body.content
        });
        const reviewId:any = newReview.dataValues.id;
        await user.addReview(reviewId);

        const place = await Place.findOne({
            where: { id: placeId },
            attributes: ['id']
        });
        await place!.addReview(reviewId);

        // 리뷰 작성 시 포인트 적립
        await Point.increment({ points: 1 }, { where: { UserId: userId } });     // increment함수: 일치한 모델이 있으면 points값 1 증가
        // 포인트 적립 로그 생성
        const newPointLog = await PointLog.create({
            action: actionType.ADD,
            reviewId: reviewId,
            updatePoint: updatePointType.create,
        });
        const pointLogId = newPointLog.dataValues.id;
        await user.addPointLog(pointLogId);

        const placeReviews:any = await Review.findAll({
            where: { PlaceId: placeId }
        });

        if (placeReviews.length === 1) {    // 해당 장소에 첫 리뷰 작성 시 1점 추가
            await Point.increment({ points: 1 }, { where: { UserId: userId } });
            const newBonusLog = await PointLog.create({
                action: actionType.ADD,
                reviewId: reviewId,
                updatePoint: updatePointType.getBonus
            });
            const bonusLogId = newBonusLog.dataValues.id;
            await user.addPointLog(bonusLogId);
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

// 리뷰 수정
router.put('/events/:reviewId', isLoggedIn, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    // reviewId가 유효하지 않다면 404 반환
    if (!reviewId) return res.status(404).end();

    // user 정보
    const user = req.user!;
    const userId = user.dataValues.id;

    const updateContent = req.body.content;     // 수정할 리뷰 내용
    await Review.findOne({ where: { id: reviewId } })
        .then(review => {
            if (!review) return res.status(404).end();
            if (review.UserId !== userId) return res.status(403).end();     // 다른 사용자가 작성한 리뷰에 접근하려고 할 때
            review.action = actionType.MOD;
            review.content = updateContent;

            // 수정사항 저장
            review.save()
                .then(_ => {
                    res.json(review);
                })
                .catch(err => {
                    res.status(500).end();
                });
        });
    
    // 리뷰 수정 시 로그 생성
    const newPointLog = await PointLog.create({
        action: actionType.MOD,
        reviewId: reviewId,
        updatePoint: updatePointType.modifiy
    });
    const pointLogId = newPointLog.dataValues.id;
    await user.addPointLog(pointLogId);
});

// 리뷰 이미지 삭제
router.delete('/img/:imageId', isLoggedIn, async (req, res, next) => {
    try {
        const user = req.user!;
        const userId = user.dataValues.id;

        const imageId = req.params.imageId;
        const image = await ReviewImage.findOne({ where: { id: imageId }});
        const reviewId = image!.dataValues.ReviewId;

        await ReviewImage.destroy({ where: { id: imageId }});

        const images = await ReviewImage.findAll({ where: {ReviewId: reviewId } });
        if (images) {
            const newPointLog = await PointLog.create({
                action: actionType.MOD,
                reviewId: reviewId,
                updatePoint: updatePointType.modifiy,
            });
            const pointLogId = newPointLog.dataValues.id;
            await user.addPointLog(pointLogId);
        }
        else {
            const newPointLog = await PointLog.create({
                action: actionType.DELETE,
                reviewId: reviewId,
                updatePoint: updatePointType.deleteImg,
            });
            const pointLogId = newPointLog.dataValues.id;
            await user.addPointLog(pointLogId);

            await Point.decrement({ points: 1 }, { where: { UserId: userId } });
        }
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 삭제
router.delete('/events/:reviewId', isLoggedIn, async (req, res) => {
    const reviewId = req.params.reviewId;
    // reviewId가 유효하지 않다면 404 반환
    if (!reviewId) return res.status(404).end();

    // user 정보
    const user = req.user!;
    const userId = user.dataValues.id;

    // 삭제하려는 리뷰와 작성한 사용자가 일치하는지 여부 파악
    const review = await Review.findOne({ where: { id: reviewId, UserId: userId } });
    if (!review) return res.status(404).end();
    
    // 리뷰 삭제 시 포인트 감소
    await Point.findOne({ where: { UserId: userId } })
        .then(async point => {
            const reviewPoint = await PointLog.findOne({
                where: { reviewId: reviewId, updatePoint: updatePointType.create }
            });
            const bonusPoint = await PointLog.findOne({
                where: { reviewId: reviewId, updatePoint: updatePointType.getBonus }
            });
            // 리뷰 작성 포인트 삭제
            if (reviewPoint) {
                point!.points -= 1;
                const newPointLog = await PointLog.create({
                    action: actionType.DELETE,
                    reviewId: reviewId,
                    updatePoint: updatePointType.delete
                });
                const pointLogId = newPointLog.dataValues.id;
                await user.addPointLog(pointLogId);
            }
            // 보너스 포인트 삭제
            if (bonusPoint) {
                point!.points -= 1;
                const newPointLog = await PointLog.create({
                    action: actionType.DELETE,
                    reviewId: reviewId,
                    updatePoint: updatePointType.deleteBonus
                });
                const pointLogId = newPointLog.dataValues.id;
                await user.addPointLog(pointLogId);
            }

            // 수정된 점수 저장
            point!.save()
            .then(_ => {
                res.json(point);
            })
            .catch(err => {
                console.error(err);
            });
        });

    // 리뷰 삭제
    await Review.destroy({ where: { id: reviewId, UserId: userId } })
        .then(() => {
            return res.status(204).end();
        });
});

export default router;