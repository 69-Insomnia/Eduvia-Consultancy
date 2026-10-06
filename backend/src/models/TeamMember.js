import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { applyApiShape } from '../utils/shape.js';

class TeamMember extends Model {}

TeamMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(v) {
        this.setDataValue('name', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Name is required' } },
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      set(v) {
        this.setDataValue('position', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Position is required' } },
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    specialization: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('specialization', typeof v === 'string' ? v.trim() : v);
      },
    },
    email: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('email', typeof v === 'string' ? v.trim().toLowerCase() : v);
      },
    },
    phone: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('phone', typeof v === 'string' ? v.trim() : v);
      },
    },
    socialLinks: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({}),
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'TeamMember',
    tableName: 'teammembers',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['order'] }],
  }
);

applyApiShape(TeamMember);

export default TeamMember;
