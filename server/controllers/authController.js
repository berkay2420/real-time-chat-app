const {
  loginService,
  registerService,
  getCurrentUserService
} = require("../services/authService");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await loginService(username, password, res);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await registerService(username, password, res);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


const getCurrentUser = async (req, res) => {
  try {
    const user = await getCurrentUserService(req);

    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};


module.exports = {
  login,
  register,
  getCurrentUser
};