import mongoose from "mongoose";
import { Usr } from "./models/usr.js";

await mongoose.connect("mongodb://localhost:27017/LogNSign");

export const checkuserem = async (em) => {
    console.log(em);
    console.log("Checking email");
    try {
        const us = await Usr.findOne({ email: em });
        if (us) {  // Compare entered email with the email in the database
            return "Email is present";
        } else {
            return "Email not present";
        }
    } catch (err) {
        return `Error: ${err.message}`;
    }
};