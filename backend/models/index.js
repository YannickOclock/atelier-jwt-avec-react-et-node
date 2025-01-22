import { Sequelize, DataTypes, Model } from "sequelize";
import config from "../config.js";

const { dialect, storage } = config.database;
export const sequelize = new Sequelize({ dialect, storage });

export class User extends Model {}

User.init({
  username: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING }
}, { sequelize });