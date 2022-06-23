import * as express from 'express';
import Point from '../../models/point';
import PointLog from '../../models/pointLog';
import { isLoggedIn } from '../../middlewares/auth';

const router = express.Router();

// 포인트 조회 API
router.get('/', isLoggedIn, async (req, res) => {
    const user = req.user!;
    const point = await Point.findOne({
        where : {
            UserId: user.dataValues.id
        }
    });
    return res.json({point: point!.dataValues.points});
});

// 포인트 증감 이력 조회
router.get('/logs', isLoggedIn, async (req, res) => {
    const user = req.user!;
    const logs = await PointLog.findAll({
        where: {
            UserId: user.dataValues.id
        },
        attributes: ['updatePoint', 'updatedAt']
    });

    return res.json(logs);
});

export default router;