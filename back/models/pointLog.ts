import { DataTypes, Model } from "sequelize";
import { dbType } from ".";
import { sequelize } from "./sequelize";

class PointLog extends Model {
    public readonly id!: string;
    public action!: string;
    public reviewId!: string;
    public updatePoint!: string;
    public readonly createAt!: Date;
    public readonly updateAt!: Date;

    public dataValues!: {
        id: any
    }
}

PointLog.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    action: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    reviewId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    updatePoint: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'PointLog',
    tableName: 'pointlogs',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

export const associate = (db: dbType) => {
    db.PointLog.belongsTo(db.User);
};

export default PointLog;