let express = require("./lib/1.express");

let app = express();

app.get("/name", function (req, res) {
  res.end("zfpx");
});
app.get("/age", function (req, res) {
  res.end("9");
});

app.post("/name", function (req, res) {
  res.end("post name");
});

app.all("*", function (req, res) {
  res.end(req.method + "user");
});

app.listen(3000, function () {
  console.log(`Server start 3000`);
});
