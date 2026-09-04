const errorHandler = (err, req, res, next) => {
  if (!err.statusCode || err.statusCode >= 500) console.error('API Error:', err.name);
  if (err.code === 11000) return res.status(409).json({ success: false, message: 'A record with this identifier already exists. Please retry.' });

  // Mongoose duplicate key error (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `An account with this ${field} already exists. Please sign in or use a different ${field}.`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.length > 0 ? messages.join('. ') : 'Validation Error',
      errors: messages,
    });
  }

  // Mongoose CastError (invalid ObjectId / ID)
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      message: `Resource not found with ID: ${err.value}`,
    });
  }

  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };
  if (err.errors) response.errors = err.errors;
  res.status(err.statusCode || 500).json(response);
};

module.exports = errorHandler;
