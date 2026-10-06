import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { applyApiShape, applySeoDefaults } from '../utils/shape';
import generateUniqueSlug from '../utils/slugify';

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      set(v) {
        this.setDataValue('title', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Blog title is required' } },
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Eduvia Team',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notNull: { msg: 'Blog content is required' } },
    },
    excerpt: {
      type: DataTypes.STRING(500),
      validate: { len: { args: [0, 500], msg: 'Excerpt cannot exceed 500 characters' } },
    },
    featuredImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    category: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('category', typeof v === 'string' ? v.trim() : v);
      },
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    readTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
    },
    seo: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({}),
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Blog',
    tableName: 'blogs',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['category'] },
      { fields: ['is_published'] },
      { fields: ['created_at'] },
      { fields: ['slug'] },
      { fields: ['tags'], using: 'gin' },
    ],
  }
);

Blog.belongsToMany(Blog, {
  through: 'blog_related_posts',
  as: 'relatedPosts',
  foreignKey: 'blogId',
  otherKey: 'relatedPostId',
});

Blog.beforeCreate(async (instance: any) => {
  instance.seo = applySeoDefaults(instance.seo);
  if (instance.title) {
    instance.slug = await generateUniqueSlug(instance.title, Blog, instance.id);
  }
  if (instance.isPublished && !instance.publishedAt) {
    instance.publishedAt = new Date();
  }
});

Blog.beforeUpdate(async (instance: any) => {
  if (instance.changed('title') && instance.title) {
    instance.slug = await generateUniqueSlug(instance.title, Blog, instance.id);
  }
  if (instance.changed('isPublished') && instance.isPublished && !instance.publishedAt) {
    instance.publishedAt = new Date();
  }
});

applyApiShape(Blog);

export default Blog as any;
