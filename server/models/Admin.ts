import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { applyApiShape } from '../utils/shape';

class Admin extends Model {
  comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, (this as any).password);
  }

  generateAuthToken() {
    return jwt.sign({ id: (this as any).id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE as any,
    });
  }
}

Admin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      set(v) {
        this.setDataValue('name', typeof v === 'string' ? v.trim() : v);
      },
      validate: {
        notNull: { msg: 'Name is required' },
        len: { args: [1, 100], msg: 'Name cannot exceed 100 characters' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(v) {
        this.setDataValue('email', typeof v === 'string' ? v.trim().toLowerCase() : v);
      },
      validate: {
        notNull: { msg: 'Email is required' },
        is: { args: /^\S+@\S+\.\S+$/, msg: 'Please provide a valid email' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Password is required' },
        len: { args: [6, 255], msg: 'Password must be at least 6 characters' },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin',
      validate: { isIn: { args: [['superadmin', 'admin']] } as any },
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'admins',
    timestamps: true,
    underscored: true,
    defaultScope: { attributes: { exclude: ['password'] } },
  }
);

Admin.beforeCreate(async (instance: any) => {
  if (instance.password) instance.password = await bcrypt.hash(instance.password, 12);
});

Admin.beforeUpdate(async (instance: any) => {
  if (instance.changed('password')) instance.password = await bcrypt.hash(instance.password, 12);
});

applyApiShape(Admin, {}, ['password']);

export default Admin as any;
