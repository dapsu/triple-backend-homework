export * from './sequelize';

import User, { associate as associateUser } from './user';
import Review, { associate as associateReview } from './review';
import Place, { associate as associatePlace } from './place';
import Point, { associate as associatePoint } from './point';
import ReviewImage, { associate as associateReviewImage } from './reviewImage';

const db = {
    User,
    Review,
    Place,
    ReviewImage,
    Point
};
export type dbType = typeof db;

// db간 관계 형성
associateUser(db);
associateReview(db);
associatePlace(db);
associatePoint(db);
associateReviewImage(db);