var jwt = require("jsonwebtoken");

require("dotenv").config();
const fs = require("fs");

const authentication = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.send("please login");
  } else {
    const blacklisttoken = JSON.parse(
      fs.readFileSync("./blacklist.json", "utf-8")
    );
    if (blacklisttoken.includes(token)) {
      res.send("please login");
    }
  }

  jwt.verify(token, process.env.normal_token, function (err, decoded) {
    if (err) {
      res.send("please login");
    } else {
      const role = decoded.role;
      req.body.userrole = role;
      
      next();
    }
  });
};

module.exports={
    authentication
}