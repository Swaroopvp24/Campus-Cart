import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// npm i bcrypt

// Define the schema for the user
const usrSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot be longer than 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    resetToken: {
      type: String, // Store the reset token
    },
    resetTokenExpiration: {
      type: Date, // Store the expiration date for the token
    },
  },
  { timestamps: true }
);

// Method to compare entered password with stored hashed password
usrSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Pre-save hook to check if username or email already exists and to hash the password
// usrSchema.pre("save", async function (next) {
//   try {
//     // Check if username already exists
//     const usernameExists = await Usr.findOne({ username: this.username });
//     if (usernameExists) {
//       return next(new Error("Username already exists"));
//     }

//     // Check if email already exists
//     const emailExists = await Usr.findOne({ email: this.email });
//     if (emailExists) {
//       return next(new Error("Email already exists"));
//     }

//     next();  // Continue with the save operation
//   } catch (err) {
//     next(err);  // Pass any errors to the next middleware
//   }
// });


usrSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();  // Only hash if password is modified

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);  // Pass any errors to the next middleware
  }
});



// Method to compare entered password with stored hashed password
// usrSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password); // Compare the password with the stored hash
// };

// Create and export the model
export const Usr = mongoose.model("Users", usrSchema);