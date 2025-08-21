const cspDirectives = (req, res, next) => {
  try {
    const baseDomain = req.get("host");
    const protocol = req.protocol;
    console.log("baseDomain", baseDomain); // keep here for logging/testing for now
    console.log("protocol", protocol); // keep here for logging/testing for now
    res.setHeader(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self'; connect-src 'self' ${protocol}://${baseDomain}`
    );
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { cspDirectives };
