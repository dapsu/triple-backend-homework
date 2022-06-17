import IUser from '../models/user';

// 기존 sequelize의  User Model 클래스에 /models/user의 모델 타입 확장
declare global {
    namespace Express {
        export interface User extends IUser {}
    }
}