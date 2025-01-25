const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "All detailes are reqired" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" }); // 409 Conflict
    }
    await User.create({
      name,
      email,
      password,
    });
    return res.render("login");
  } catch (err) {}
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  // const user = await User.findOne({ email, password });

  // if (!user)
  //   return res.render("login", {
  //     error: "Invalid Username or Password",
  //   });

  // const sessionId = uuidv4();
  // setUser(sessionId, user);
  // res.cookie("uid", sessionId);
  // return res.redirect("/");

  if (!email || !password) {
    return res.render("login");
  }
  try {
    const existingUser = await User.findOne({ email, password });
    if (!existingUser) {
      return res.render("login");
    }
    const sessionId = uuidv4();
    setUser(sessionId, existingUser);
    res.cookie("uid", sessionId);
    return res.render("home");
  } catch (err) {}
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
