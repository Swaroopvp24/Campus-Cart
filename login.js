// import mongoose from "mongoose";
// import { Usr } from "./models/usr.js";
// await mongoose.connect("mongodb://localhost:27017/LogNSign");

// export const checkuser = async (user, pass) => {
//     try {
//         const us = await Usr.findOne({ username: user });
//         if (us && await us.matchPassword(pass)) {  // Compare entered password with stored hash
//             return "Login successful";
//         } else {
//             return "Login failed: Invalid username or password";
//         }
//     } catch (err) {
//         return `Error: ${err.message}`;
//     }
// };

import { Usr } from "./models/usr.js";

export const checkuser = async (user, pass) => {
    try {
        const us = await Usr.findOne({ username: user });
        if (us && await us.matchPassword(pass)) {  // Compare entered password with stored hash
            return "Login successful";
        } else {
            return "Login failed: Invalid username or password";
        }
    } catch (err) {
        return `Error: ${err.message}`;
    }
};