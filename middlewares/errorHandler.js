// eslint-disable-next-line no-unused-vars
module.exports = (error, _req, res, _next) => {
  console.error(error.message);
  const status = error.statusCode || 500;
  const errors = error.errors || { server: 'Server error. Please, try again later' };
  res.status(status).json({ errors });
};
