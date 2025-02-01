import express from "express";
import multer from "multer";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { retuem } from "./retem.js";
import { Usr } from "./models/usr.js";
import { newuser } from "./addusr.js";
import { checkuser } from "./login.js";
import { checkuserem } from "./checkem.js";
import path from 'path';

// import { setnewpass } from './setnewp.js';


const app = express();
const port = 3000;
const upload = multer();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views")); // Ensure views folder is set correctly

app.use(express.static("public")); // Serve static files like CSS/JS if needed
// app.use(express.static("public"));

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));


await mongoose.connection.close();

await mongoose
  .connect("mongodb://localhost:27017/CampusCart")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));






app.post("/clicksignup", upload.none(), async (req, res) => {
  // console.log(req.body);
  // res.send("Form data received");
  const { usernamesignup, email, passwordsignup } = req.body;
  if (!usernamesignup || !passwordsignup || !email) {
    return res.status(400).send("Missing username or password or email"); // Send a 400 response if missing
  }

  const result = await newuser(usernamesignup, email, passwordsignup);
  res.send(result);
});




// app.post("/clicksignin", upload.none(), async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(400).send("Missing username or password"); // Send a 400 response if missing
//   }

//   const result = await checkuser(username, password);
//   // res.send(result);
//   if(result == "Login successful"){
//     console.log("Login result:", result);
//     // res.redirect("/index");
//     // res.redirect("http://127.0.0.1:3000/index");
//     res.writeHead(302, { Location: "/index" });
// res.end();
//   }else{
//     res.send(result);
//   }
// });

app.post("/clicksignin", upload.none(), async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Missing username or password");
  }

  const result = await checkuser(username, password);
  if (result === "Login successful") {
    res.json({ success: true, redirectUrl: "/index" }); // Send a redirect URL
  } else {
    res.json({ success: false, message: result }); // Send error message
  }
});

// Set up storage engine for Multer (files will be stored in /public/uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    // Use the original name with a timestamp prefix to avoid conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter to accept only images (jpeg, png, etc.)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize multer
const uploadItemImage = multer({ storage, fileFilter });

app.get("/index", (req, res) => {
  res.render("index"); // This will render index.ejs from the views folder
});





app.post("/forgpass", upload.none(), async (req, res) => {
  // console.log("Request received");
  // console.log(req.body);
  const { forgemail } = req.body;
  // console.log("Received email:", forgemail); // This should show the email from the form

  const result = await checkuserem(forgemail);
  res.send(result);
});




app.post("/request-reset-password", upload.none(), async (req, res) => {
  // console.log("Request received");
  const { email } = req.body;

  // Check if the email exists in the database
  // const user = await Usr.findOne({ email });
  const user = await retuem(email);
  // console.log(user);
  if (!user) {
    return res.status(404).send("User with that email address not found.");
  }

  // Generate a unique token
  const token = crypto.randomBytes(20).toString("hex");

  // Set token expiration time (1 hour from now)
  const expirationTime = Date.now() + 3600000; // 1 hour in milliseconds

  // Save the token and expiration time to the database
  await Usr.updateOne(
    { _id: user._id }, // Find the user by their _id
    {
      resetToken: token,
      resetTokenExpiration: expirationTime,
    }
  );
  // console.log("Token saved to database");

  // Send the reset token to the user's email
  // console.log("Sending email...");
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Example: 'Gmail', 'SendGrid', etc.
    auth: {
      user: "swaroopsurya2005@gmail.com", // Your email address
      pass: "rmtsexyixpiuqoef", // Your email password or API key
    },
  });

  const resetUrl = `http://127.0.0.1:3000/setnpass?token=${token}`;

  const mailOptions = {
    from: "swaroopsurya2005@gmail.com",
    to: user.email,
    subject: "Password Reset Request",
    text: `You have requested a password reset. Click the following link to reset your password: ${resetUrl}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.status(500).send("Error sending email");
    }
    // console.log("Email sent:", info.response);
    res.send("Password reset email sent successfully.");
  });
});




app.get("/setnpass", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token is required.");
  }

  try {
    // Find user with the matching reset token and ensure token is not expired
    const user = await Usr.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, // Check if the token is expired
    });

    if (!user) {
      return res.status(400).send("Invalid or expired token.");
    }

    // Render a page or a form for resetting the password
    // For simplicity, we'll return a message here:
    res.send(`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form style="background-color: #57B894; padding: 20px; border-radius: 5px;" action="/setnpass" method="POST"
        enctype="multipart/form-data">
        <input type="hidden" name="token" value="${token}" />
        <label for="password" style="color: white;">New Password:</label>
        <input type="password" id="password" name="password" placeholder="New password" required
            style="margin-bottom: 10px; padding: 5px; width: 100%;">
        
        <!-- Add a toggle checkbox to show/hide the password -->
        <label for="togglePassword" style="color: white; cursor: pointer;">
            <input type="checkbox" id="togglePassword" style="margin-top: 10px;">
            Show Password
        </label>

        <br>
        
        <button type="submit"
            style="margin-top: 1rem; cursor: pointer; background-color: white; color: #57B894; padding: 10px 20px; border: none; border-radius: 5px;">Reset
            Password</button>
    </form>

    <script>
        // Add event listener to toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        togglePassword.addEventListener('change', function () {
            // Toggle password input type
            if (togglePassword.checked) {
                passwordInput.type = 'text';
            } else {
                passwordInput.type = 'password';
            }
        });

        // Check if there is a message in the query string and display it
        const urlParams = new URLSearchParams(window.location.search);
        const message = urlParams.get('message');
        if (message) {
            document.body.insertAdjacentHTML('beforeend', '<p style="color: red;">' + message + '</p>');
        }
    </script>
</body>

</html>
`);
  } catch (error) {
    await console.log(error);
    res.status(500).send("Error processing the request.");
  }
});





app.post("/setnpass", upload.none(), async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).send("Token and password are required.");
  }

  // Find user by reset token and check if the token is valid and not expired
  try {
    const user = await Usr.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, // Ensure the token is not expired
    });

    if (!user) {
      return res.status(400).send("Invalid or expired token.");
    }

    // Check if the new password is the same as the old one
    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
      // If the new password is the same as the old one, redirect to the form with an error message
      return res.redirect(
        `/setnpass?token=${token}&message=Your%20new%20password%20is%20the%20same%20as%20the%20old%20one.%20Please%20choose%20a%20different%20password.`
      );
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    // console.log("Salt generated");
    const hashedPassword = (user.password = await bcrypt.hash(password, salt));
    console.log("Password hashed", hashedPassword);

    // Save without triggering validation (pre-save)
    await Usr.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword, // Set the new password
        },
        $unset: {
          resetToken: "", // Unset the resetToken field
          resetTokenExpiration: "", // Unset the resetTokenExpiration field
        },
      }
    );

    res.send(
`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f4f7;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            width: 100%;
            max-width: 400px;
        }

        h1 {
            color: #57B894;
            margin-bottom: 20px;
        }

        p {
            font-size: 16px;
            color: #555;
            margin-bottom: 20px;
        }

        a {
            color: #57B894;
            text-decoration: none;
            font-weight: bold;
            padding: 5px 10px;
            border: 1px solid #57B894;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        a:hover {
            background-color: #57B894;
            color: #fff;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Password Reset Successful</h1>
        <p>Your password has been reset successfully.</p>
        <p>Click <a href="http://127.0.0.1:3000/login_signup.html">here</a> to log in.</p>
    </div>
</body>

</html>
`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error resetting the password.");
  }
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
