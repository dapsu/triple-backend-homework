export * from './sequelize';

import User, { associate as associateUser } from './user';
import Review, { associate as associateReview } from './review';
import Place, { associate as associatePlace } from './place';
import Point, { associate as associatePoint } from './point';
import PointLog, { associate as associatePointLog } from './pointLog';
import ReviewImage, { associate as associateReviewImage } from './reviewImage';

const db = {
    User,
    Review,
    Place,
    ReviewImage,
    Point,
    PointLog
};
export type dbType = typeof db;

// db간 관계 형성
associateUser(db);
associateReview(db);
associatePlace(db);
associatePoint(db);
associatePointLog(db);
associateReviewImage(db);