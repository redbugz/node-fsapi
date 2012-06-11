var config = module.exports;

config["FSApi tests"] = {
  rootPath: "../",
  environment: "node", // or "browser"
  sources: [
    "lib/fsapi.js",
    "lib/**/*.js"
  ],
  tests: [
    "test/*-test.js"
  ]
}
