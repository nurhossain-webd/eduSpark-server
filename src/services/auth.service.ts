import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User, { IUser } from "../models/User";
import {
  LoginInput,
  RegisterInput,
} from "../validations/auth.validation";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role: "user" | "admin";
}

export interface LoginResult {
  user: SafeUser;
  accessToken: string;
}

function createSafeUser(user: IUser): SafeUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image ?? "",
    role: user.role,
  };
}

export async function registerUser(
  payload: RegisterInput,
): Promise<SafeUser> {
  const existingUser = await User.findOne({
    email: payload.email,
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    12,
  );

  const createdUser: IUser = await User.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    image: "",
    role: "user",
  });

  return createSafeUser(createdUser);
}

export async function loginUser(
  payload: LoginInput,
): Promise<LoginResult> {
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

const accessToken = jwt.sign(
  {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET as string,
  {
    expiresIn: "7d",
  },
);

  return {
    user: createSafeUser(user),
    accessToken,
  };
}