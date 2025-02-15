# Campus Cart

A full-stack web application designed for a campus marketplace. Users can sign up, log in, browse items, and post items for sale. The application uses Express.js, EJS for templating, Tailwind CSS (with custom animations and effects) for styling, and MongoDB for data storage.

---

## Problem Statement

Students on campus need a simple, efficient platform to buy and sell items such as textbooks, gadgets, and other personal belongings. Existing solutions can be too complex or not tailored to campus environments. **Campus Cart** solves this problem by providing:

- **User Authentication:** Secure sign up, login, and password reset functionalities.
- **Profile Management:** A dedicated profile page displaying user information.
- **Item Listings:** A responsive, dynamic interface to browse and post items for sale.
- **Search Functionality:** Both client-side filtering and server-side search options.
- **Responsive Design:** A modern layout that adapts to desktop and mobile devices.

---

## Solution Overview

The solution is built using a Node.js backend with Express.js and MongoDB (using Mongoose). EJS is used for server-side templating to dynamically render pages, while Tailwind CSS and custom CSS provide a sleek, modern design with smooth animations. Key features include:

- **User Authentication:** Manage user sessions for sign up, login, and password reset.
- **Dynamic Item Listings:** Items are displayed in reverse order (latest first) and are searchable.
- **File Uploads:** Images for items are uploaded using Multer.
- **Profile Page:** Users can view their profile information (username and email).

---

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Frontend:** EJS, HTML5, CSS3, Tailwind CSS, Bootstrap
- **File Upload:** Multer
- **Development Tools:** Nodemon, concurrently (or npm-run-all) for running multiple processes
- **Version Control:** Git

---

## Installation and Running

### Prerequisites

- **Node.js** (v14 or later recommended)
- **MongoDB** (local instance or MongoDB Atlas)

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/campus-cart.git
   cd campus-cart
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

-MONGODB_URI=mongodb://localhost:27017/CampusCart

SESSION_SECRET=your_very_secure_secret

PORT=3000

4. **Run Tailwind CSS and Server Concurrently (Optional):**

   ```bash
   npm install concurrently --save-dev
   ```

-**Update your package.json scripts:**

```bash
        "scripts":
        {
        "tailwind": "npx @tailwindcss/cli -i ./src/input.css -o ./public/output.css --watch",
        "server": "nodemon apprun.js",
        "dev": "concurrently \"npm run tailwind\" \"npm run server\""
         }
```

-**Then run:**

```bash
npm run dev
```


5. **Run the Application:**
   If not using the concurrent script, start your server with:

   ```bash
   npm start
   ```

   or

   ```bash
   nodemon apprun.js
   ```

Then navigate to http://127.0.0.1:3000/login_signup.html (or your configured port) in your browser.
