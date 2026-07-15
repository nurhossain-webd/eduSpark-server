"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getCurrentUser = getCurrentUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
function createSafeUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image ?? "",
        role: user.role,
    };
}
async function registerUser(payload) {
    const existingUser = await User_1.default.findOne({
        email: payload.email,
    });
    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }
    const hashedPassword = await bcryptjs_1.default.hash(payload.password, 12);
    const createdUser = await User_1.default.create({
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        image: "",
        role: "user",
    });
    return createSafeUser(createdUser);
}
async function loginUser(payload) {
    const user = await User_1.default.findOne({
        email: payload.email,
    });
    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }
    const passwordMatches = await bcryptjs_1.default.compare(payload.password, user.password);
    if (!passwordMatches) {
        throw new Error("INVALID_CREDENTIALS");
    }
    const accessToken = jsonwebtoken_1.default.sign({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return {
        user: createSafeUser(user),
        accessToken,
    };
}
async function getCurrentUser(userId) {
    const user = await User_1.default.findById(userId);
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    return createSafeUser(user);
}
