import express from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/authRoutes.js";
import { app, server } from "./socket/socket.js";
import messageRouter from "./routes/messageRoutes.js";
import connectDb from "./database/mongoConnector.js";
import path from "path";
import { fileURLToPath } from "url"; // Add this import
import fs from "fs"; // Add this import for path verification
const PORT = process.env.PORT || 5000;
// Proper __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//log incoming request
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.path}`);
  next();
});
// //routes
app.use("/api/auth", authRouter);
app.use("/api/official", messageRouter);

app.use((req, res, next) => {
  console.log(`Raw URL: ${req.url}`);
  console.log(`Original URL: ${req.originalUrl}`);
  next();
});
app.use((req, res, next) => {
  const error = new Error("route not found");
  error.status = 404;
  next(error);
});

app.get("/debug", (req, res) => {
  const staticPath = path.join(__dirname, "../chatFrontend/dist");
  res.json({
    currentDir: __dirname,
    staticPath,
    pathExists: fs.existsSync(staticPath),
    files: fs.existsSync(staticPath) ? fs.readdirSync(staticPath) : [],
  });
});

// 2. THEN Static files (production only)
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../chatFrontend/dist");
  console.log("Static files path verified:", fs.existsSync(staticPath));

  // Serve static files with index.html enabled
  app.use(express.static(staticPath)); // Remove index:false

  // SPA fallback - must come last
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}
//global error handler
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  console.error("Error:", message);
  res.status(status).json({ error: message });
});

connectDb()
  .then(
    server.listen(PORT, () => {
      console.log("Server running on port:", PORT);
    })
  )
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
