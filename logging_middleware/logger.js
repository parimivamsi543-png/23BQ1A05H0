require("dotenv").config();
const axios = require("axios");
require("dotenv").config();

console.log(process.env.AUTH_TOKEN);
async function Log(stack, level, pkg, message) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
}

module.exports = Log;