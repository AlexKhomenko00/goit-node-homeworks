class UnauthorizedError extends Error {
  constructor(msg) {
    super(msg);

    this.status = 401;
  }
}

module.exports = {
  UnauthorizedError,
};
