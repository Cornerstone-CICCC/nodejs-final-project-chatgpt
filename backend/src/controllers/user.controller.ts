import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { error } from "console";

// get all users
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

//get user by id
const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id)
    if (!user) {
      res.status(404).json({ error : "User not found"})
      return
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
// get user by email
const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// login user
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email or password missing" });
    return 
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid email or password" });
      return
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: "Invalid email or password" });
      return
    }

    if (req.session) {
      req.session.isLoggedIn = true;
      req.session.userId = user._id;
    }

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

// add/register user
const addUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, authProvider = "local" } = req.body;

  if (!email || (!password && authProvider === "local")) {
    res.status(400).json({ error: "Missing required fields" });
    return
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "Email is already registered" });
      return
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      authProvider,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// edit user
const editUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, password } = req.body;

  try {
    const updates: any = { firstName, lastName, email };

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      res.status(404).json({ error: "User does not exist!" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};


// delete user
const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    res.status(200).json({ message: "Deleted user!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// logout
const logout = (req: Request, res: Response) => {
  req.session = null;
  res.status(200).json({ message: "Logged out successfully" });
};

// check cookie
const checkCookie = (req: Request, res: Response) => {
  if (req.session && req.session.userId) {
    res.status(200).json({ loggedIn: true, userId: req.session.userId });
  } else {
    res.status(401).json({ loggedIn: false });
  }
};

export default {
  getUsers,
  getUserById,
  getUserByEmail,
  loginUser,
  addUser,
  logout,
  checkCookie,
  editUserById,
  deleteUserById
};
