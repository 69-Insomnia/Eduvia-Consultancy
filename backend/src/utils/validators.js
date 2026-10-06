import validator from 'validator';

export const validateEmail = (email) => {
  if (!email) return false;
  return validator.isEmail(email);
};

export const validatePhone = (phone) => {
  if (!phone) return false;
  return validator.isMobilePhone(phone, 'any', { strictMode: false });
};

export const validateRequired = (fields, body) => {
  const missing = [];
  for (const field of fields) {
    if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
      missing.push(field);
    }
  }
  return missing;
};

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return validator.trim(validator.escape(str));
};
