const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http")
const httpProxy = require("http-proxy")
const responseTime = require('response-time')

const app = express();

const newsletterRoutes = require('./Routes/newsletterRoutes.js'); // Import the newsletter routes
app.use(express.json()); // This middleware is necessary for parsing JSON in the request body

app.use(cors());
app.use("/static", express.static("public"));

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./DB/users.db'); // Path to the user database


app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;


  // Basic validation to ensure all fields are filled
  if (!firstName || !lastName || !email || !password) {
    return res.json({ error: 'All fields are required' });
  }


  // SQL query to insert new user
  const query = `INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`;


  db.run(query, [firstName, lastName, email, password], function (err) {
    if (err) {
      // Handle case where email might already be in use (unique constraint)
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.json({ error: 'Email already in use' });
      }
      return res.json({ error: 'Error registering user' });
    }
    // Send success response
    res.json({ success: true, userId: this.lastID });
  });
});



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


