const jobService = require("../services/jobs.service");

// GET Get Jobs //
exports.GetJobs = async (req, res) => {
  try {
    console.log("GET request received to " + req.get("host") + req.originalUrl);
    console.log("request body: ");
    console.log(req.body);
    const jobs = await jobService.GetJobs(req.body);

    return res.status(200).json({
      count: jobs.count,
      jobs: jobs.result
    });

  } catch (err) {
      return res.status(500).send("Internal Server Error");
  }
};

// GET Total Jobs (Count) //
exports.TotalJobs = async (req, res) => {
  console.log("GET request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);
  try {
    var jobsCount = await jobService.TotalJobs();
    return res.status(200).json({ count: jobsCount });
  }

  catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

// GET Search Jobs //
exports.SearchJobs = async (req, res) => {
  console.log("GET request received to " + req.get("host") + req.originalUrl)
  console.log("request body: ")
  console.log(req.body)
  try {
    const jobs = await jobService.SearchJobs(req.body)
    return res.status(200).json({
      count: jobs.count,
      jobs: jobs.result,
      new: jobs.result.reduce( // counts the number of new jobs
        (previousValue, currentValue) => {
            return previousValue + (currentValue.IsNew ? 1 : 0)
        }, 0
      ) 
    })

  } catch (err) {
      return res.status(500).send("Internal Server Error")
  }
};

// GET Job Details //
exports.GetJobDetails = async (req, res) => {
  console.log("GET request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);
  try {
    const jobDetails = await jobService.GetJobDetails(req.body.jobID, req.body.language);
    if (Array.isArray(jobDetails.PeriodOfEmployment.Description) && jobDetails.PeriodOfEmployment.Description.length === 0) {
      return res.status(200).json({ ...jobDetails, PeriodOfEmployment: null});
    }

    return res.status(200).json(jobDetails);

  } catch (err) {
      return res.status(500).send("Internal Server Error");
  }
};

// GET Search Cities //
exports.SearchCities = async (req, res) => {
  console.log("GET request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);
  try {
    const searchResult = await jobService.SearchCities(req.body.searchTerm);

    return res.status(200).json(searchResult);

  } catch (err) {
      return res.status(500).send("Internal Server Error");
  }
};