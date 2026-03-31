const userRepo = require("../repositories/userRepository");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

async function registerUser(name, email, password) {
  const existing = await userRepo.findUserByEmail(email);
  if (existing) throw new Error("User already exists");

  const hashed = await hashPassword(password);
  return await userRepo.createUser(name, email, hashed);
}

async function loginUser(email, password) {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = generateToken({ id: user.id });

  return { token };
}

module.exports = { registerUser, loginUser };