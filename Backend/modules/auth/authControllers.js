const authService = require("./authService.js");

const register = async (req, res, next) => {
  try {
    const newUser = await authService.registerUser(req.body);
    return res.status(201).json({
      message: "User successfully registered!",
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { token, user } = await authService.loginUser(req.body);
    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const resetToken = await authService.generateResetToken(req.body.email);
    return res.status(200).json({
      message: "Reset token generated successfully.",
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.executePasswordReset(req.params.token, req.body.password);
    return res.status(200).json({
      message: "Password successfully updated! You can now log in."
    });
  } catch (error) {
    next(error);
  }
};

const oauthCallback = (req, res, next) => {
  try {
    const token = authService.generateOAuthToken(req.user);
    return res.status(200).json({
      message: "Social authentication completed successfully!",
      token,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  oauthCallback,
};