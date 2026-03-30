const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

async function registerUser(name, email, password) {
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser(
    name,
    email,
    hashedPassword
  );

  return user;
}

async function loginUser(email, password) {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token };
}

module.exports = {
  registerUser,
  loginUser,
};