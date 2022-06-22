import { DataTypes, Model } from "sequelize";
import { dbType } from ".";
import { sequelize } from "./sequelize";

class Point extends Model {
    public readonly id!: string;
    public points!: number;
    public readonly createAt!: Date;
    public readonly updateAt!: Date;

    public dataValues!: {
        id: any,
        points: number
    }
}

Point.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Point',
    tableName: 'points',
    charset: 'utf8', 
    collate: 'utf8_general_ci'
});

export const associate = (db:dbType) => {
    db.Point.belongsTo(db.User);
};

export default Point;