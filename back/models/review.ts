import { DataTypes, HasManyAddAssociationMixin, Model } from "sequelize";
import { dbType } from ".";
import { sequelize } from "./sequelize";
import ReviewImage from './reviewImage';

class Review extends Model {
    public readonly id!: string;
    public type!: string;
    public action!: string;
    public content!: string;
    public attachedPhotoIds!: Array<string>;
    public readonly createAt!: Date;
    public readonly updateAt!: Date;
    
    public UserId!: number;
    public PlcaeId!: number;
    
    public dataValues!: {
        id: any,
        UserId: any,
        PlaceId: any
    }

    public addReviewImage!: HasManyAddAssociationMixin<ReviewImage, number>;
}

Review.init({
    id: {
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    action: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    content: {
        type: DataTypes.STRING(300),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

export const associate = (db: dbType) => {
    db.Review.belongsTo(db.User);
    db.Review.belongsTo(db.Place);
    db.Review.hasMany(db.ReviewImage);
};

export default Review;