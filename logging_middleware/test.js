const Log = require("./logger");

(async () => {
  const result = await Log(
    "backend",
    "info",
    "controller",
    "Logging middleware tested successfully"
  );

  console.log(result);
})();