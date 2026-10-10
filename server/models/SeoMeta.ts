import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { applyApiShape } from '../utils/shape';

/**
 * Per-entity SEO overrides stored outside the entity's own `seo` subdocument
 * (the table admin created in Supabase: public.seo_meta).
 *
 * `entity_type` + `entity_id` identify the target (e.g. service + slug);
 * `json_ld` holds extra structured data nodes rendered alongside the built-in
 * JSON-LD. Public read / authenticated write is enforced by RLS on the table
 * itself in addition to the API middleware.
 */
class SeoMeta extends Model {}

SeoMeta.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    entityType: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'entity_type',
      set(v) {
        this.setDataValue('entityType', typeof v === 'string' ? v.trim().toLowerCase() : v);
      },
      validate: { notNull: { msg: 'entity_type is required' } },
    },
    entityId: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'entity_id',
      set(v) {
        this.setDataValue('entityId', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'entity_id is required' } },
    },
    metaTitle: { type: DataTypes.TEXT, field: 'meta_title' },
    metaDescription: { type: DataTypes.TEXT, field: 'meta_description' },
    ogImageUrl: { type: DataTypes.TEXT, field: 'og_image_url' },
    ogTitle: { type: DataTypes.TEXT, field: 'og_title' },
    ogDescription: { type: DataTypes.TEXT, field: 'og_description' },
    canonicalUrl: { type: DataTypes.TEXT, field: 'canonical_url' },
    noindex: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    jsonLd: { type: DataTypes.JSONB, field: 'json_ld' },
    // Explicit mapping: the table has only updated_at (no created_at), and
    // `underscored` alone does not rename the timestamp in ORDER BY clauses.
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'SeoMeta',
    tableName: 'seo_meta',
    createdAt: false,
    underscored: true,
  }
);

// The unique (entity_type, entity_id) pair lives on the table itself (created
// by the migration), so the model never needs to sync it.

applyApiShape(SeoMeta);

export default SeoMeta as any;
