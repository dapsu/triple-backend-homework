import * as express from 'express';
import { isLoggedIn } from '../../middlewares/auth';
import Place from '../../models/place';

const router = express.Router();

// place 조회
router.get('/:id', isLoggedIn, async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    try {
        const place = await Place.findOne({
            where: { id },
            attributes: ['id', 'placeName', 'country', 'location']
        });
        if (!place) return res.status(404).end();
        res.json(place);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

// place 추가
router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const alreadyPlace = await Place.findOne({
            where : {
                placeName: req.body.placeName
            }
        });
        if (alreadyPlace) return res.status(403).send('이미 등록된 여행장소 입니다.');

        const newPlace = await Place.create({
            placeName: req.body.placeName,
            country: req.body.country,
            location: req.body.location
        });
        return res.status(200).json(newPlace);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

export default router;