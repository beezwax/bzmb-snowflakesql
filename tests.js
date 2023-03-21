const auth = require("./auth.js");
const statement = require("./statement.js");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const os = require("os");

const args = process.argv.slice(2);

const [ functionName ] = args;
if (functionName === "auth") {
  (async () => {
    const accessToken = await auth(JSON.parse(args.slice(1)));
    console.log(accessToken);
  })();
} else if(functionName === "statement") {
  (async () => {
    const result = await statement(JSON.parse(args.slice(1)));
    const fileName = `${crypto.randomUUID()}.json`
    const filePath = path.join(os.homedir(), "Documents", fileName);
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
  })();
}