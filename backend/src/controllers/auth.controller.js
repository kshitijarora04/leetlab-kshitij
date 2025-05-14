import bcrypt from "bcryptjs";
import { db } from "../../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password, name} = req.body;

  try {
    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        error: "User Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: { email, password: hashedPassword, name},
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // sending the cookie so we automatically login
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV != "development",
      maxAge: 1000 * 60 * 60 * 24 * 7, //7days
    });

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Error creating User",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, Please Register" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid Credentials",
      });
    }

    // creates a jwt token with the payload id where key is id and value is user.id, jwt secret and expiry
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV != "development",
      maxAge: 1000 * 60 * 60 * 24 * 7, //7days
    });

    res.status(201).json({
      success: true,
      message: "User Logged in Successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error logging in  user:", error);
    res.status(500).json({
      error: "Error logging in User",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    console.error("Error logging in  user:", error);
    res.status(500).json({
      error: "Error logging in User",
    });
  }
};

// We use a middleware here which checks if the user is authenticated and then we pass this controller
export const check = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User Authneticated successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({
      error: "Error checking User",
    });
  }
};
