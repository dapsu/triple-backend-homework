import { DataTypes, Model } from "sequelize";
import { dbType } from ".";
import { sequelize } from "./sequelize";

class ReviewImage extends Model {
    public readonly id!: string;
    public type!: string;
    public imageName!: string;
    public data!: string;
    public readonly createAt!: Date;
    public readonly updateAt!: Date;

    public dataValues!: {
        id: any,
        data: any,
        ReviewId: any
    }
}

ReviewImage.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {     // BLOB(Binary Large Object): 가변적인 데이터를 저장할 수 있는 바이너리 형태의 큰 객체(이미지, 비디오 등 멀티미디어 객체 주로 다룸)
        type: DataTypes.BLOB('long'),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'ReviewImage',
    tableName: 'reviewImages',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

export const associate = (db: dbType) => {
    db.ReviewImage.belongsTo(db.Review);
};

export default ReviewImage;