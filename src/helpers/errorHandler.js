const express = require('express');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'An unexpected error occurred',
      code: err.code || 'INTERNAL_SERVER_ERROR',
    },
  });
};

const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ authenticated: false, message });
};

const handleSuccess = (res, message, object) => {
  res.status(200).json({ message, object });
};

module.exports = {
  sendErrorResponse,
  errorHandler,
  handleSuccess,
};
