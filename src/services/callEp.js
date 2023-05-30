const axios = require("axios");
const apiPublic = async (method, to, data, token = null) => {
  var options = {
    method: method,
    url: to,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
    timeout: 5000,
  };

  const result = await axios.request(options);
  return result.data || null;
};

module.exports = { apiPublic };
