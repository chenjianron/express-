let express = require("./lib/2.middleware");

let app = express();

app.use("/name", function (req, res, next) {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  next("名字不合法");
});
app.use(function (req, res, next) {
  console.log("middleware");
  next();
});
app.get("/age", (req, res) => {
  res.end("年龄9岁");
});
app.get("/name/n", (req, res) => {
  res.end("珠峰培训");
});
//错误中间件(4个参数)放到路由的下面
app.use(function (err, req, res, next) {
  console.log(err);
  next(err);
});
app.use(function (err, req, res, next) {
  console.log(err);
});
app.listen(8080, () => {
  console.log(`server start 8080`);
});
