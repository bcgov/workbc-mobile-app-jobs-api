var express = require('express');
var cors = require('cors');
var app = express();
require('dotenv').config();
var jobRouter = require('./routes/job');
var cron = require('node-cron');
var fs = require('fs')
const PythonShell = require('python-shell').PythonShell;

cron.schedule('0 0 0 * * *', () => { // will run at midnight daily
  runJobsImport();
});

cron.schedule('0 0 12 * * *', () => { // will run at noon daily
  runJobsImport();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })) //Parse URL-encoded bodies
app.use(cors());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8081,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.locals.jobs= JSON.parse(fs.readFileSync('src/dao/json/job.json', 'utf8'));
app.use('/jobs', jobRouter);

app.get('/', function (req, res) {
  res.send("WORKBC-JOBS-API: Server is Running.");
});

const runJobsImport = () => {
  console.log(new Date(Date.now()) + ": Starting job listings import ...");

  PythonShell.run('src/scripts/import_job_listings.py', null, function (err, res) {
    if (err) throw err;
    console.log(new Date(Date.now()) + ": Finished job listings import!");
    let jobs = JSON.parse(fs.readFileSync('src/dao/json/job.json', 'utf8'));
    if (jobs !== "" || typeof jobs !== undefined || jobs !== null){
      app.locals.jobs= jobs
    }
  });
}

app.listen(port, function () {
  console.log('Started at port %s', port);
  runJobsImport()
});