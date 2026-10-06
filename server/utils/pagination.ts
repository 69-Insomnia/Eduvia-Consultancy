const paginate = (page = 1, limit = 10) => {
  const p = Math.max(1, parseInt(page as any, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit as any, 10) || 10));
  const skip = (p - 1) * l;

  return {
    page: p,
    limit: l,
    skip,
    setTotal: (total) => ({
      page: p,
      limit: l,
      total,
      totalPages: Math.ceil(total / l),
      hasPrev: p > 1,
      hasNext: p < Math.ceil(total / l),
    }),
  };
};

export default paginate;
