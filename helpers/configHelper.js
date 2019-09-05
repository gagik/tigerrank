const fs = require("fs");
const configFile = fs.readFileSync("config.json");
const config = JSON.parse(configFile);

module.exports = {
    CAS: config["CAS"],
    MONGO: config["MONGO"],
    info: config["info"],
}