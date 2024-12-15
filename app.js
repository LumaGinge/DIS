const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const httpProxy = require("http-proxy");
const responseTime = require('response-time');
require("dotenv").config();

const app = express();
app.use(express.json()); // middleware som er nødvendig for at express skal kunne parse json
const cookieParser = require('cookie-parser'); // Importer cookie-parser
app.use(cookieParser());
 // her hentes alle routes ind
const authenticateToken = require('./middleware/authenticateToken');
const protectedRoutes = require('./Routes/protectedRoutes.js');
const twilioRoutes = require('./Routes/twilioRoutes.js');
const signupRoutes = require('./Routes/signupRoutes.js');
const loginRoutes = require('./Routes/loginRoutes.js');
const newsletterRoutes = require('./Routes/newsletterRoutes.js'); 
const ordersRoutes = require('./Routes/ordersRoutes');

app.use(cors({
  origin: 'https://joejuice.store', // tilpass til egen domæne
  credentials: true, // tillad cookies fra browser
}));

app.use("/static", express.static("public"));
app.use('/protected', authenticateToken);
app.use('/protected', protectedRoutes);
app.use('/api', twilioRoutes);
app.use('/api', signupRoutes);
app.use('/api', loginRoutes);
app.use('/newsletter', newsletterRoutes); 
app.use('/api', ordersRoutes);




app.get("/", (req, res) => { // Her sendes index.html til klienten
  res.sendFile(path.join(__dirname, "public", "index.html")); 
});

app.get("/res", (req, res) => {
  res.send("Response message from server");
});

// her oprettes en server på port 3001
const server1 = http.createServer(app).listen(3001, () => {
  console.log('Express HTTP server listening on port %d', server1.address().port);
});

const server2 = http.createServer(app).listen(3002, () => {
  console.log('Express HTTP server listening on port %d', server2.address().port);
});

const server3 = http.createServer(app).listen(3003, () => {
  console.log('Express HTTP server listening on port %d', server3.address().port);
});
// her er serverne defineret i et array
let addresses = [
  { host: 'localhost', port: server1.address().port, protocol: 'http' },
  { host: 'localhost', port: server2.address().port, protocol: 'http' },
  { host: 'localhost', port: server3.address().port, protocol: 'http' }
];

// HTTP Proxy sættes op
const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  cookieRewrite: true, // Sørger for at cookies bliver skrevet korrekt
});

// Round Robin Load Balancer
const loadBalancer = http.createServer((req, res) => {
  // Vælger den næste server fra listen
  const target = addresses.shift(); // Tager den første server fra arrayet
  console.log('Load balancing request to:', target);

  // Proxy anmodningen til den valgte server
  proxy.web(req, res, {
    target: `${target.protocol}://${target.host}:${target.port}`,
  }, (err) => {
    if (err) {
      console.error('Error with proxy:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  // Skubber den valgte server tilbage til slutningen af listen
  addresses.push(target);
}).listen(3000, () => {
  console.log('Load balancer running at port 3000');
});

