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
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  })
);
app.use(helmet.frameguard({ action: "DENY"}));
app.use('/jobs', jobRouter);

app.get('/', function (req, res) {
  res.send("WORKBC-JOBS-API: Server is Running.");
});

app.listen(port, function () {
  console.log('Started at port %s', port);
});