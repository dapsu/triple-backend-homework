import { DataTypes, Model } from "sequelize";
import { dbType } from ".";
import { sequelize } from "./sequelize";

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
        id: Review;
    }
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
};

export default Review;