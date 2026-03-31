const authService = require("../services/authService");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const user = await authService.registerUser(name, email, password);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const { token } = await authService.loginUser(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.json({
      message: "Login successful"
    });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

module.exports = { register, login };