import { DataTypes, Model } from "sequelize";
import { dbType } from ".";
import { sequelize } from "./sequelize";

class User extends Model {
    public readonly id!: number;
    public email!: string;
    public userName!:string;
    public password!: string;
    public readonly createAt!: Date;
    public readonly updateAt!: Date;
}

// User 모델 init
User.init({
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

};

export default User;