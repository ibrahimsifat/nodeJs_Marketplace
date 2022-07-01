const notFoundHandler = (status, message) => {
  return res.status(status).json({ Error: message });
};
module.exports = {
  notFoundHandler,
};
