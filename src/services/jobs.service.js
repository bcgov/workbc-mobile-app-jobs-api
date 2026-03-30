const { DateTime } = require("luxon");
const { jobsApi } = require("../config/config");
const PAGE_SIZE = 30;

module.exports.GetJobs = async (params) => {
  try {
    let jobTitle = params.jobTitle?.trim();
    let minimumPostedDate;
    if (params.minimumPostedDate)
      minimumPostedDate = DateTime.fromISO(params.minimumPostedDate);

    let url =
      params.language.toUpperCase() === "FR"
        ? "Search/JobSearch/fr"
        : "Search/JobSearch";
    const jobs = await jobsApi.post(
      url,
      JSON.stringify({
        page: params.page ? params.page : 1,
        pageSize: PAGE_SIZE,
        keyword: jobTitle,
        searchInField: "title",
        startDate: minimumPostedDate
          ? {
              year: minimumPostedDate.year,
              month: minimumPostedDate.month,
              day: minimumPostedDate.day,
            }
          : null,
        searchDateSelection: 3, // required when using startDate (3 corresponds to 'date range')
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return jobs.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

((module.exports.TotalJobs = async () => {
  try {
    const epoch = DateTime.now().setZone("pst").valueOf();
    const jobsCount = await jobsApi.get(`Search/GetTotalJobs?t=${epoch}`);
    return jobsCount.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}),
  (module.exports.SearchJobs = async (params) => {
    try {
      let jobTitle = params.jobTitle
        ? params.jobTitle.toLowerCase().trim()
        : "";
      let location = params.location ? params.location.trim() : "";
      let url =
        params.language.toUpperCase() === "FR"
          ? "Search/JobSearch/fr"
          : "Search/JobSearch";
      let minimumPostedDate;
      if (params.minimumPostedDate) {
        minimumPostedDate = DateTime.fromISO(params.minimumPostedDate);
      }

      const jobs = await jobsApi.post(
        url,
        JSON.stringify({
          page: params.page ? params.page : 1,
          pageSize: PAGE_SIZE,
          keyword: jobTitle,
          searchInField: "all",
          searchLocations: [
            {
              city: location, // case insensitive
              region: "",
              postal: "",
            },
            {
              city: "",
              region: capitalizeFirstLetter(location), // region seems to be case sensitive and likes having the first letter capitalized
              postal: "",
            },
            {
              city: "",
              region: "",
              postal: location, // T3X 5V0 and T3X5V0 are both acceptable (i.e. spacing doesn't matter)
            },
          ],
          searchLocationDistance: -1, // required when using searchLocations
          startDate: minimumPostedDate
            ? {
                year: minimumPostedDate.year,
                month: minimumPostedDate.month,
                day: minimumPostedDate.day,
                hour: minimumPostedDate.hour,
                minute: minimumPostedDate.minute,
                second: minimumPostedDate.second,
                millisecond: minimumPostedDate.millisecond,
              }
            : null,
          searchDateSelection: 3, // required when using startDate (3 corresponds to 'date range')
          sortOrder: 11,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return jobs.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }));

module.exports.GetJobDetails = async (jobID, language) => {
  try {
    const params = {
      jobId: jobID,
      language: language,
      isToggle: false, // increments view count if set to true
    };

    const jobDetails = await jobsApi.get("Search/GetJobDetail", {
      params,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("[service] GetJobDetail RESPONSE: ", jobDetails.data.result);

    return jobDetails.data.result[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.SearchCities = async (searchTerm) => {
  try {
    const jobDetails = await jobsApi.get(`Location/Cities/${searchTerm}`);
    return jobDetails.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// HELPER FUNCTIONS //
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
