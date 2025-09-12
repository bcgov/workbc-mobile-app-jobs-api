var express = require('express');
var cors = require('cors');
var helmet = require('helmet');
var app = express();
require('dotenv').config();
var jobRouter = require('./routes/jobs.route');

app.use(express.json());
app.use(express.urlencoded({ extended: true })) //Parse URL-encoded bodies
app.use(cors());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8081,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: "DENY",
    },
  })
);

app.use('/jobs', (req, res, next) => {
  const baseDomain = req.get("host");
  const protocol = req.protocol;
  console.log('Base Domain:', `${protocol}://${baseDomain}`);
  const csp = helmet.contentSecurityPolicy({
    "default-src": ["'self'"],
    "script-src": ["'self'",],
    "content-src": ["'self'", `${protocol}://${baseDomain}`],
  })
  csp(req, res, (err) => {
    if (err) {
      console.log('CSP Error:', err);
      return res.status(500).send('CSP Error');
    }
    next();
   });
}, jobRouter);

app.get('/', function (req, res) {
  res.send("WORKBC-JOBS-API: Server is Running.");
});

app.listen(port, function () {
  console.log('Started at port %s', port);
});