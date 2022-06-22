import { DataTypes, HasManyAddAssociationMixin, Model } from "sequelize";
import { dbType } from ".";
import { sequelize } from "./sequelize";
import Review from "./review";
import PointLog from "./pointLog";

class User extends Model {
    public readonly id!: string;
    public email!: string;
    public userName!:string;
    public password!: string;
    public readonly createAt!: Date;
    public readonly updateAt!: Date;

    public dataValues!: {
        id: any
    }

    public addReview!: HasManyAddAssociationMixin<Review, number>;      // review와 관계 형성 때 생성되는 메소드
    public addPointLog!: HasManyAddAssociationMixin<PointLog, number>;      // review와 관계 형성 때 생성되는 메소드
}

// User 모델 init
User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    userName: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    charset: 'utf8', 
    collate: 'utf8_general_ci'
});

// 관계 형성 
export const associate = (db: dbType) => {
    db.User.hasMany(db.Review);
    db.User.hasOne(db.Point);
    db.User.hasMany(db.PointLog);
};

export default User;