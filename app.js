const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http")
const httpProxy = require("http-proxy")
const responseTime = require('response-time')
require("dotenv").config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const app = express();

const newsletterRoutes = require('./Routes/newsletterRoutes.js'); // Import the newsletter routes
app.use(express.json()); // This middleware is necessary for parsing JSON in the request body

app.use(cors());
app.use("/static", express.static("public"));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const signupRoutes = require('./Routes/signupRoutes.js');
app.use('/api', signupRoutes);

const loginRoutes = require('./Routes/loginRoutes.js');
app.use('/api', loginRoutes);

const twilioRoutes = require('./Routes/twilioRoutes.js');
app.use('/api', twilioRoutes);

app.use('/newsletter', newsletterRoutes); // Mount the newsletter routes under /newsletter
app.use((req, res, next) => {
  /*console.log("----- HTTP Request -----"); 
  console.log(`Method: ${req.method}`); // HTTP Method
  console.log(`URL: ${req.originalUrl}`); // Requested URL
  console.log("Headers:", req.headers); // Request Headers
  console.log(`IP: ${req.ip}`); // IP Address
  console.log("------------------------");*/
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/res", (req, res) => {
  res.send("Response message from server");
});


//Create HTTP servers for load balancing
const server1 = http.createServer(app).listen(3001, () => {
  console.log('Express HTTP server listening on port %d', server1.address().port)
})

const server2 = http.createServer(app).listen(3002, () => {
  console.log('Express HTTP server listening on port %d', server2.address().port)
})

const server3 = http.createServer(app).listen(3003, () => {
  console.log('Express HTTP server listening on port %d', server3.address().port)
})

let addresses = [
  { host: 'localhost', port: server1.address().port, protocol: 'http' },
  { host: 'localhost', port: server2.address().port, protocol: 'http' },
  { host: 'localhost', port: server3.address().port, protocol: 'http' }
];

// HTTP Proxy setup
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

// Round Robin Load Balancer
const loadBalancer = http.createServer((req, res) => {
  // Pick the next server in the list (Round Robin)
  const target = addresses.shift(); // Take the first server from the list
  console.log('Load balancing request to:', target);

  // Proxy the request to the selected server
  proxy.web(req, res, {
    target: `${target.protocol}://${target.host}:${target.port}`,
  }, (err) => {
    if (err) {
      //console.error('Error with proxy:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  // Push the used server to the end of the array (Round Robin)
  addresses.push(target);
}).listen(3000, () => {
  console.log('Load balancer running at port 3000');
});


