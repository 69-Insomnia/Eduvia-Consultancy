/**
 * Shared helpers that keep the Sequelize models emitting exactly the JSON
 * shape the Mongoose models used to emit, so the frontend needs no changes.
 */

const isInstance = (v) =>
  v !== null && typeof v === 'object' && v.dataValues !== undefined && typeof v.toJSON === 'function';

const serialize = (v) => {
  if (v === null || v === undefined) return v;
  if (Array.isArray(v)) return v.map(serialize);
  if (isInstance(v)) return v.toJSON();
  return v;
};

/**
 * Give a model the Mongoose wire format:
 *  - `id` is exposed as `_id` (string), never as `id`
 *  - a foreign key column (`studentId`) is exposed as `student` — with the
 *    raw uuid when the relation was not populated, or the nested document
 *    when it was (Sequelize forbids alias === foreignKey, so the move from
 *    `studentId` → `student` happens here instead).
 *
 * `refs` maps foreignKey attribute name → association alias.
 * `hide` lists attributes that never appear in JSON (Admin.password).
 */
export const applyApiShape = (ModelClass, refs = {}, hide = []) => {
  ModelClass.prototype.toJSON = function toJSON() {
    const obj = {};
    for (const [key, value] of Object.entries(this.dataValues)) {
      obj[key] = serialize(value);
    }
    for (const [fk, alias] of Object.entries(refs)) {
      if (obj[alias] === undefined && obj[fk] !== undefined) obj[alias] = obj[fk];
      delete obj[fk];
    }
    for (const key of hide) delete obj[key];
    if (Object.prototype.hasOwnProperty.call(obj, 'id')) {
      obj._id = obj.id;
      delete obj.id;
    }
    return obj;
  };
  return ModelClass;
};

/**
 * Strips the Mongoose bookkeeping keys a client may echo back (`_id`,
 * `__v`, timestamps, `id`) so `Model.create(req.body)` / `save()` behave
 * like the strict-mode Mongoose documents did.
 */
export const cleanBody = (body = {}) => {
  const data = { ...body };
  delete data._id;
  delete data.id;
  delete data.__v;
  delete data.createdAt;
  delete data.updatedAt;
  return data;
};

/** Renames a Mongoose-style relation key (`student`) to the column (`studentId`). */
export const takeRef = (data, key) => {
  if (data[key] !== undefined && data[`${key}Id`] === undefined) {
    data[`${key}Id`] = data[key];
    delete data[key];
  }
  return data;
};

export const seoDefaults = { ogType: 'website', robots: 'index,follow' };

/** Fills the two schema-level SEO defaults the Mongoose paths carried. */
export const applySeoDefaults = (seo) => ({ ...seoDefaults, ...(seo || {}) });
