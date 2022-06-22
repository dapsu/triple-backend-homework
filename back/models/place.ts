import { DataTypes, HasManyAddAssociationMixin, Model } from "sequelize";
import { dbType } from ".";
import { sequelize } from "./sequelize";
import Review from "./review";

class Place extends Model {
    public readonly id!: string;
    public placeName!: string;
    public country!: string;
    public location!: string;
    public readonly createAt!: Date;
    public readonly updateAt!: Date;
    
    public reviews!: Array<string>;

    public dataValues!: {
        id: any
    }

    public addReview!: HasManyAddAssociationMixin<Review, number>;
}

Place.init({
    id: {
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    placeName: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    country: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Place',
    tableName: 'places',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

export const associate = (db: dbType) => {
    db.Place.hasMany(db.Review);
};

export default Place;