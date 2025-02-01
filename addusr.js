import mongoose from "mongoose";
import { Usr } from "./models/usr.js";

// await mongoose.connect("mongodb://localhost:27017/CampusCart");

export const newuser = async (user, emai, pass) => {
  try {
    const us = await new Usr({
      username: user,
      email: emai,
      password: pass,
    });
    await us.save().catch((err) => {
      throw new Error(err);
    });
    return `Added succesfully`;
  } catch (err) {
    return `${err.message}`;
  }
};
