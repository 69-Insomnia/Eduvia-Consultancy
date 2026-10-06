import { Op } from 'sequelize';
import { sequelize } from '../config/db.js';

/** Escapes user input for a LIKE/ILIKE pattern (default escape char is backslash). */
export const escapeLike = (s) => String(s).replace(/[\\%_]/g, (m) => `\\${m}`).replace(/'/g, "''");

/** Case-insensitive "contains" — the Postgres stand-in for {$regex, $options:'i'}. */
export const iLike = (q) => ({ [Op.iLike]: `%${escapeLike(q)}%` });

/** ILIKE over a jsonb column's text form (used for string-array fields like tags). */
export const jsonTextILike = (column, q) =>
  sequelize.where(sequelize.cast(sequelize.col(column), 'text'), {
    [Op.iLike]: `%${escapeLike(q)}%`,
  });

/** jsonb array "contains any of" — the stand-in for `field: {$in: [...]}` on arrays. */
export const jsonArrayContainsAny = (field, values) => ({
  [Op.or]: values.map((v) => ({ [field]: { [Op.contains]: [v] } })),
});

/** A plain equals filter. */
export const eq = (v) => ({ [Op.eq]: v });

/** A >= filter. */
export const gte = (v) => ({ [Op.gte]: v });
