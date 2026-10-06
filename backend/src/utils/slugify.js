import slugifyLib from 'slugify';

const generateUniqueSlug = async (name, Model, existingId = null) => {
  let base = slugifyLib(name, { lower: true, strict: true });
  let slug = base;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (existingId) {
      query._id = { $ne: existingId };
    }
    const existing = await Model.findOne(query).lean();
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
};

export default generateUniqueSlug;
