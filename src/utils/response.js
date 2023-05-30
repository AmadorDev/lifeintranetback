function getResponse(res, data, status = false) {
  const status_code = {
    200: "OK",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    500: "Internal Server Error",
    800: "required fields",
  };

  const response = {
    msg: status_code[data.code],
    data: data.data,
    status: status,
  };
  if (data.api) {
    response.api = data.api;
  }
  res.status(data.code).json(response);
}

module.exports = {
  getResponse,
};
