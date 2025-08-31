const favicon = require("serve-favicon");
const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerDocs = require("./swagger/swagger");
const { initializeRedis } = require("./redis/redisClient");
const { authenticateToken } = require("./middleware/jwt");
require("dotenv").config();
const {
  registerUser,
  loginUser,
  uploadDocument,
  generateKeyIdeas,
  generateDiscussionPoints,
  chatWithAI,
  forgotPassword,
  verifyEmail,
  getAllDocuments,
  getDocumentById,
  getDocumentDetails,
  deleteAllDocuments,
  deleteDocument,
  getDaysSinceJoined,
  getDocumentCount,
  updateUserEmail,
  updateUserPassword,
  getUserEmail,
  updateDocumentTitle,
  getUserJoinedDate,
  updateTheme,
  updateSocialMedia,
  getSocialMedia,
  sentimentAnalysis,
  actionableRecommendations,
  summaryInLanguage,
  bulletSummary,
  contentRewriting,
  searchDocuments,
  processAudioFile,
  refineSummary,
} = require("./controllers/controllers");

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",            // local frontend
  "https://doc-talk-five.vercel.app"  // deployed frontend
  "https://doctalk-31u3.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Swagger, Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

initializeRedis();
app.get("/swagger.json", (req, res) => {
  res.json(swaggerDocs);
});


app.get("/api-docs", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>DocTalk API Docs</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
        <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@4.15.5/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@4.15.5/favicon-16x16.png" sizes="16x16" />
        <style>body { margin: 0; padding: 0; }</style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            SwaggerUIBundle({
              url: '/swagger.json',
              dom_id: '#swagger-ui',
              presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
              layout: "StandaloneLayout"
            })
          }
        </script>
      </body>
    </html>
  `);
});

// Redirect root route to /api-docs
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/forgot-password", forgotPassword);
app.post("/verify-email", verifyEmail);
app.post("/upload", authenticateToken, uploadDocument);
app.post("/generate-key-ideas", generateKeyIdeas);
app.post("/generate-discussion-points", authenticateToken, generateDiscussionPoints);
app.post("/chat", authenticateToken, chatWithAI);
app.get("/documents/:userId", authenticateToken, getAllDocuments);
app.get("/documents/:userId/:docId", authenticateToken, getDocumentById);
app.get("/document-details/:userId/:docId", authenticateToken, getDocumentDetails);
app.delete("/documents/:userId/:docId", authenticateToken, deleteDocument);
app.delete("/documents/:userId", authenticateToken, deleteAllDocuments);
app.post("/update-email", authenticateToken, updateUserEmail);
app.post("/update-password", authenticateToken, updateUserPassword);
app.get("/days-since-joined/:userId", authenticateToken, getDaysSinceJoined);
app.get("/document-count/:userId", authenticateToken, getDocumentCount);
app.get("/users/:userId", authenticateToken, getUserEmail);
app.post("/update-document-title", authenticateToken, updateDocumentTitle);
app.get("/user-joined-date/:userId", authenticateToken, getUserJoinedDate);
app.put("/update-theme", authenticateToken, updateTheme);
app.get("/social-media/:userId", authenticateToken, getSocialMedia);
app.post("/update-social-media", authenticateToken, updateSocialMedia);
app.post("/sentiment-analysis", authenticateToken, sentimentAnalysis);
app.post("/actionable-recommendations", authenticateToken, actionableRecommendations);
app.post("/summary-in-language", authenticateToken, summaryInLanguage);
app.post("/bullet-summary", authenticateToken, bulletSummary);
app.post("/content-rewriting", authenticateToken, contentRewriting);
app.get("/search-documents/:userId", authenticateToken, searchDocuments);
app.post("/process-audio", authenticateToken, processAudioFile);
app.post("/refine-summary", authenticateToken, refineSummary);
app.get("/health", (req, res) => {
  console.log("Health check hit");
  res.status(200).send("OK");
});

// Error handling for unsupported routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Unauthorized handler FIRST
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  next(err);
});

// ✅ Global error handler LAST
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({
    error: "An internal server error occurred",
    details: err.message,
  });
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
