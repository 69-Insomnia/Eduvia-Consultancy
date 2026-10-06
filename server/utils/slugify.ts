import slugifyLib from 'slugify';
import { Op } from 'sequelize';

const generateUniqueSlug = async (name, Model, existingId = null) => {
  let base = slugifyLib(name, { lower: true, strict: true });
  let slug = base;
  let counter = 1;

  while (true) {
    const where: any = { slug };
    if (existingId) where.id = { [Op.ne]: existingId };
    const existing = await Model.findOne({ where });
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
};

export default generateUniqueSlug;
