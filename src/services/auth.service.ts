import bcrypt from "bcryptjs";

import User, { IUser } from "../models/User";
import { RegisterInput } from "../validations/auth.validation";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role: "user" | "admin";
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

  return {
    id: createdUser._id.toString(),
    name: createdUser.name,
    email: createdUser.email,
    image: createdUser.image ?? "",
    role: createdUser.role,
  };
}