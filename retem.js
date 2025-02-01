import mongoose from "mongoose";
import { Usr } from "./models/usr.js";

await mongoose.connect("mongodb://localhost:27017/LogNSign");

// retuem.js
export const retuem = async (em) => {
    // console.log("Checking email:", em);
    try {
      const user = await Usr.findOne({ email: em });
      if (user) {
        return user; // Return the user document
      } else {
        return null; // Return null if the user doesn't exist
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      return null; // Return null or handle the error
    }
  };
  