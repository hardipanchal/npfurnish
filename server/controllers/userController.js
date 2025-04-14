import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendEmailFun from "../config/sendEmail.js";
import { verifyEmailTemplate } from "../utils/verifyEmailTemplate.js";
import generatedRefreshtoken from "../utils/generatedRefreshToken.js";
import generatedAccesstoken from "../utils/generatedAccessToken.js";

dotenv.config();

// Register User
// Register User
export async function registerUserController(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({ message: "Provide all required fields", error: true });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ message: "User already registered", error: true });
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.json({
        message: "Phone number already registered",
        error: true,
      });
    }

    // Generate a numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit numeric OTP

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      otp: otp, // Save numeric OTP
      otpExpires: Date.now() + 600000, // 10 minutes expiration
    });

    const savedUser = await user.save();

    // Send verification email (you can use the otp directly in the email)
    await sendEmailFun(
      email,
      "Verify your email - NPFurnish",
      `Your verification code is ${otp}`,
      verifyEmailTemplate(name, otp)
    );

    return res.status(200).json({
      success: true,
      message: "User registered! Please verify email.",
      token: jwt.sign(
        { email, id: user._id },
        process.env.JSON_WEB_TOKEN_SECRET_KEY,
        { expiresIn: "1h" }
      ),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true });
  }
}

// Verify Email
// Verify Email
export async function verifyEmailController(req, res) {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ error: true, success: false, message: "User not found" });
    }

    // Check if OTP has expired
    const isNotExpired = user.otpExpires > Date.now();

    // Compare the OTP entered by the user with the stored OTP (assuming it's stored as plain text)
    const isCodeValid = user.otp === parseInt(otp, 10); // Ensure otp is a number

    console.log("verify", isCodeValid, isCodeValid);
    if (isCodeValid && isNotExpired) {
      // OTP is valid, mark the user as verified
      user.isVerified = true;
      user.otp = null; // Clear the OTP after successful verification
      user.otpExpires = null; // Clear the OTP expiration date

      // Save the user after updating
      const updatedUser = await user.save(); // Save and get updated user
      console.log("Updated User after saving:", updatedUser); // Log updated user

      // Send verification success email
      await sendEmailFun(
        email,
        "Your email has been verified!",
        "Congratulations! Your email has been successfully verified."
      );

      return res
        .status(200)
        .json({
          error: false,
          success: true,
          message: "Email verified successfully",
        });
    } else if (!isCodeValid) {
      return res
        .status(400)
        .json({ error: true, success: false, message: "Invalid OTP" });
    } else {
      return res
        .status(400)
        .json({ error: true, success: false, message: "OTP expired" });
    }
  } catch (error) {
    console.error("❌ Error during email verification:", error);
    return res
      .status(500)
      .json({ message: error.message || error, error: true });
  }
}

export async function loginUserController(req, res) {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }

    // Check if user is deleted
    if (user.isDeleted) {
      return res.status(403).json({
        message: "Your account has been deleted. Contact support.",
        error: true,
        success: false,
      });
    }

    // Check if user is active
    if (user.status !== "active") {
      return res.status(400).json({
        message: "User not active",
        error: true,
        success: false,
      });
    }

    // Check password
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
        error: true,
        success: false,
      });
    }

    // Generate tokens
    const accessToken = await generatedAccesstoken(user._id, user.role);
    const refreshToken = await generatedRefreshtoken(user._id);

    // Update login details
    user.lastLogin = new Date();       // <== Using new field name
    user.isLoggedIn = true;            // <== Mark user as logged in
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    await user.save();                 // <== Save changes

    // Set cookies
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.json({
      message: "Login successful",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          status: user.status,
          role: user.role,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function logoutController(req, res) {
  try {
    const userId = req.userId;

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    await User.findByIdAndUpdate(userId, {
      refresh_token: "",
      access_token: "",
      isLoggedIn: false, // 👈 Mark user as logged out
    });

    return res.json({
      message: "Logout successful",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



export async function forgotPasswordController(req, res) {
  debugger
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log("Received email:", email);

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({
        message: "Invalid email address",
        error: true,
        success: false,
      });
    }
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    } else {
      let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      user.otp = verifyCode;

      user.otpExpires = Date.now() + 600000;

      await user.save();

      console.log("🔍 Email type before sending:", typeof email);
      console.log("🔍 Email value before sending:", email);
      
      console.log("📧 Sending email to:", email, typeof email);

      await sendEmailFun(
        String(email).trim(), // Ensure it's a clean string
        "Verify Email from NPFurnish App",
        "",
        verifyEmailTemplate(user.name, verifyCode)
      );
      
      

      console.log(email)
      return res.json({
        message: "Verification code sent to your email",
        error: false,
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

export async function verifyForgotPasswordOtp(req, res) {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide required fields: email and OTP.",
        error: true,
        success: false,
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    // Debugging logs
    console.log(`🔍 Checking OTP for user: ${email}`);
    console.log(`🔹 Received OTP: ${otp}, User OTP: ${user.otp}`);
    console.log(`🔹 OTP Expiry Time: ${user.otpExpires}`);

    // Convert both OTPs to strings for comparison
    if (String(otp) !== String(user.otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    // Check OTP expiration
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP is expired",
        error: true,
        success: false,
      });
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    console.log(`✅ OTP verified successfully for: ${email}`);

    return res.status(200).json({
      message: "OTP verified successfully",
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("❌ Error in verifyForgotPasswordOtp:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}
//resest password 
export async function resetPassword(req, res)
{
  try{
    const {email, newPassword, confirmPassword } = req.body

    if(!email || ! newPassword || !confirmPassword)
    {
      return res.status(400).json({
        message : "provide required fields email, newPassword, confirmPassword"
      })
    }
    const user = await User.findOne({email})
    if(!user)
    {
      return res.status(400).json({
        message : "Email is not available",
        error: true,
        success: false
      })
    }

    if(newPassword !== confirmPassword)
      {
        return res.status(400).json({
          message : "newpassword and confirm password must be same.",
          error: true,
          success: false
        })
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(confirmPassword, salt);

      user.password = hashedPassword;
      await user.save();

      return res.json({
        message : "Password updated successfully.",
        error: false,
        success: true
      })

  }
  catch(error)
  {
    return res.status(500).json({
      message : error.message || error,
      error : true,
      success :false
    })
  }
}


export async function refreshToken(req, res) {
  try {
    // Get refresh token from cookies or headers
    const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];

    // If no token is provided
    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN, async (err, verifyToken) => {
      if (err) {
        return res.status(401).json({
          message: "Token is expired or invalid",
          error: true,
          success: false,
        });
      }

      // If token is valid, proceed to generate a new access token
      const userId = verifyToken.id;
      const newAccessToken = await generatedAccesstoken(userId);

      // Set the new access token in cookies
      const cookiesOption = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };
      res.cookie('accessToken', newAccessToken, cookiesOption);

      // Respond with the new access token
      return res.json({
        message: "New Access Token generated",
        error: false,
        success: true,
        data: {
          accessToken: newAccessToken,
        },
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}


export async function userDetails(req, res) {
  try {
    console.log("✅ User ID from request:", req.userId);

    const userId = req.userId; // Get the userId from request (set by the auth middleware)
    console.log(userId);

    // Find the user and exclude sensitive fields
    const user = await User.findOne({ _id: userId, isDeleted: false }).select('-password -refresh_token');

    if (!user) {
      return res.status(404).json({
        message: "User not found or deleted",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: 'User details retrieved successfully',
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: true,
      success: false,
    });
  }
}
// route: GET /api/profile/me
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // populated by auth middleware

    const profileData = await User.findById(userId).select("-password");

    if (!profileData) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: profileData });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


export async function deleteUserController(req, res) {
  try {
    const userId = req.userId; // Get user ID from auth middleware

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Check if user is already deleted
    if (user.isDeleted) {
      return res.status(400).json({
        message: "User is already deleted",
        error: true,
        success: false,
      });
    }

    // Soft delete the user by setting isDeleted to true
    user.isDeleted = true;
    await user.save();

    return res.json({
      message: "User account deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: true,
      success: false,
    });
  }
}

