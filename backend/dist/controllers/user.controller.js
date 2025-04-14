"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
// get all users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
// get user by email
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
// login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Email or password missing" });
        return;
    }
    try {
        const user = yield user_model_1.User.findOne({ email });
        if (!user || !user.password) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        if (req.session) {
            req.session.isLoggedIn = true;
            req.session.userId = user._id;
        }
        res.status(200).json({ message: "Login successful", userId: user._id });
    }
    catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});
// add/register user
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, authProvider = "local" } = req.body;
    if (!email || (!password && authProvider === "local")) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    try {
        const existingUser = yield user_model_1.User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: "Email is already registered" });
            return;
        }
        const hashedPassword = password ? yield bcrypt_1.default.hash(password, 10) : undefined;
        const newUser = new user_model_1.User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            authProvider,
        });
        const savedUser = yield newUser.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create user" });
    }
});
// edit user
const editUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;
    try {
        const updates = { firstName, lastName, email };
        if (password) {
            updates.password = yield bcrypt_1.default.hash(password, 10);
        }
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) {
            res.status(404).json({ error: "User does not exist!" });
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update user" });
    }
});
// delete user
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedUser = yield user_model_1.User.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        res.status(200).json({ message: "Deleted user!" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});
// logout
const logout = (req, res) => {
    req.session = null;
    res.status(200).json({ message: "Logged out successfully" });
};
// check cookie
const checkCookie = (req, res) => {
    if (req.session && req.session.userId) {
        res.status(200).json({ loggedIn: true, userId: req.session.userId });
    }
    else {
        res.status(401).json({ loggedIn: false });
    }
};
exports.default = {
    getUsers,
    getUserByEmail,
    loginUser,
    addUser,
    logout,
    checkCookie,
    editUserById,
    deleteUserById
};
