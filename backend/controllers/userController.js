import User from "../models/userModel.js";
import sendToken from "../utils/jwtToken.js";
import sendMail from "../utils/sendMail.js";
import crypto from "crypto";

export const registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create(req.body);

    sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        sucess: false,
        message: "User not found",
      });
    }
    user = await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

export const resetPasswordRequest = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    let resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const url = `http://localhost:5173/reset-password/${resetToken}`;
    const message = `Click on the link to reset your password ${url}`;

    await sendMail(user.email, "Reset Password", message);
    return res.status(200).json({
      success: true,
      message: `Reset password link sent to ${user.email}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if(!user){
      return res.status(400).json({
        success: false,
        message: "Reset password token is invalid or has expired",
      });
    }

    const { newPassword, confirmNewPassword } = req.body;
    if(newPassword !== confirmNewPassword){
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

export const updatePassword = async (req, res) => {
  try{
    const user = await User.findById(req.params.id);
    if(!user){
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if(newPassword !== confirmNewPassword){
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if(!isMatch){
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      })
    }

    user.password = newPassword;
    sendToken(user, 200, res);
  }

  catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error
    })
  }
}