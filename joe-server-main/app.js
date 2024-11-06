const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const newsletterRoutes = require('./Routes/newsletterRoutes.js'); // Import the newsletter routes
app.use(express.json()); // This middleware is necessary for parsing JSON in the request body

app.use(cors());
app.use("/public", express.static("public"));

app.use('/newsletter', newsletterRoutes); // Mount the newsletter routes under /newsletter
app.use((req, res, next) => {
    console.log("----- HTTP Request -----");
    console.log(`Method: ${req.method}`); // HTTP Method
    console.log(`URL: ${req.originalUrl}`); // Requested URL
    console.log("Headers:", req.headers); // Request Headers
    console.log(`IP: ${req.ip}`); // IP Address
    console.log("------------------------");
    next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/res", (req, res) => {
  res.send("Response message from server");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
