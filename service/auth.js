// const sessionIdToUserMap = new Map();
const jwt = require("jsonwebtoken");
const secrete = "Shubham$12345";
function setUser(user) {
  return jwt.sign({ id: user._id, email: user.email }, secrete);
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secrete);
  } catch (error) {}
}

module.exports = {
  setUser,
  getUser,
};
