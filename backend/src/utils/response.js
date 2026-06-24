export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = { success: true, message };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

export const sendError = (res, message = 'An error occurred', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
