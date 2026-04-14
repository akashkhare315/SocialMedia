// const express = require("express");
// const authRoutes = require("./routes/auth.routes.js");
// const cookieParser = require("cookie-parser");
// //const cookieParser = require("cookie-parser");

// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", authRoutes);

// const app = express();

// module.exports = app;


const express = require("express");
const authRoutes = require("./routes/auth.routes.js");
const postRoutes = require("./routes/post.routes.js");
const userRoutes = require("./routes/user.routes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const errorHandler = require("./middleware/error.middleware.js");

const app = express(); // ✅ Create app first

// Security Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));
  
  app.use((req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// Global Error Handler (must be last middleware)
app.use(errorHandler);

module.exports = app;
