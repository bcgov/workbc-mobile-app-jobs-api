const cspDirectives = (req, res, next) => {
  const baseDomain = req.get("host");
  console.log("baseDomain", baseDomain); // keep here for logging/testing for now
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self'; connect-src 'self' http://${baseDomain}`
  );
  next();
};

module.exports = { cspDirectives };
