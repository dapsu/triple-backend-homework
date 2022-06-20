export * from './sequelize';

import User, { associate as associateUser } from './user';
import Review, { associate as associateReview } from './review';
import Place, { associate as associatePlace } from './place';

const db = {
    User,
    Review,
    Place
};
export type dbType = typeof db;

// db간 관계 형성
associateUser(db);
associateReview(db);
associatePlace(db);