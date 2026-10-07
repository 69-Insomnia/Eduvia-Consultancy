const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err.stack);

  if (err.name === 'CastError') {
    error.message = `Resource not found with id ${err.value}`;
    return res.status(404).json({ success: false, message: error.message });
  }

  // Postgres: invalid uuid input — the equivalent of a Mongo CastError.
  if (err.name === 'SequelizeDatabaseError' && err.original?.code === '22P02') {
    const match = /invalid input (?:value|syntax) for type uuid: "([^"]+)"/.exec(err.original?.message || err.message || '');
    const value = match ? match[1] : 'unknown';
    return res
      .status(404)
      .json({ success: false, message: `Resource not found with id ${value}` });
  }

  if (err.code === 11000 || err.name === 'SequelizeUniqueConstraintError') {
    const field =
      (err.fields && Object.keys(err.fields)[0]) || err.errors?.[0]?.path || 'value';
    error.message = `Duplicate value for field '${field}'. Please use another value`;
    return res.status(400).json({ success: false, message: error.message });
  }

  if (
    (err.name === 'ValidationError' || err.name === 'SequelizeValidationError') &&
    Array.isArray(err.errors)
  ) {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    error.message =
      err.parent?.detail || 'Cannot delete or update a record that is referenced elsewhere';
    return res.status(400).json({ success: false, message: error.message });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};

export default errorHandler;
