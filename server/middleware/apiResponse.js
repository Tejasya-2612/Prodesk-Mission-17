export function apiResponse(req, res, next) {
  const originalJson = res.json.bind(res);

  res.success = (data = {}, message = '', statusCode = 200) => {
    res.status(statusCode);
    return originalJson({
      success: true,
      message,
      data
    });
  };

  res.fail = (message = 'Request failed', statusCode = 500, errors = []) => {
    res.status(statusCode);
    return originalJson({
      success: false,
      message,
      errors
    });
  };

  res.json = (body = {}) => {
    if (typeof body === 'object' && body !== null && typeof body.success === 'boolean') {
      return originalJson(body);
    }

    if (res.statusCode >= 400) {
      return originalJson({
        success: false,
        message: body.message || 'Request failed',
        errors: body.errors || []
      });
    }

    return originalJson({
      success: true,
      message: body.message || '',
      data: body
    });
  };

  next();
}
