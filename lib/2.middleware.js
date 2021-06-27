let http = require("http");
let url = require("url");
function createApplication() {
    let app = (req, res) => {
    let m = req.method.toLowerCase();
    let { pathname } = url.parse(req.url, true);
    let index = 0;
    function next(err) {
      if (index === app.routes.length)
        return res.end(`Cannot ${m} ${pathname}`);
      let { method, path, handler } = app.routes[index++]; //每次调用next就应该取下一个layer
      if (err) {
        //如果有错误我应该去找错误中间件，错误中间件有一个特点，有四个参数
        if (handler.length === 4) {
          handler(err, req, res, next);
        } else {
          //如果没有匹配到，要将err继续传递下去
          next(err); //继续走下一个layer继续判断
        }
      } else {
        //如果数组全部递归完成还没有找到 说明路径不存在
        if (method === "middle") {
          //处理中间件
          if (
            path === "/" ||
            path === pathname ||
            pathname.startsWith(path + "/")
          ) {
            handler(req, res, next);
          } else {
            next();
          }
        } else {
          if (
            (method === m || method === "all") &&
            (path === pathname || path === "*")
          ) {
            handler(req, res);
          } else {
            next();
          }
        }
      }
    }
    next(); //中间件中的next方法

    // for (let i = 0; i < app.routes.length; i++) {
    //   let { method, path, handler } = app.routes[i];
    //   if (
    //     (method === m || method === "all") &&
    //     (path === pathname || path === "*")
    //   ) {
    //     handler(req, res);
    //   }
    // }
    // res.end(`Cannot ${m} ${pathname}`);
  };
  app.routes = [];
  app.use = function (path, handler) {
    if (typeof handler !== "function") {
      handler = path;
      path = "/";
    }
    let layer = {
      method: "middle",
      path,
      handler,
    };
    app.routes.push(layer);
  };
  app.all = function (path, handler) {
    let layer = {
      method: "all",
      path,
      handler,
    };
    app.routes.push(layer);
  };
  http.METHODS.forEach((method) => {
    method = method.toLocaleLowerCase();
    app[method] = function (path, handler) {
      let layer = {
        method,
        path,
        handler,
      };
      app.routes.push(layer);
    };
  });
  app.listen = function () {
    let server = http.createServer(app);
    server.listen(...arguments);
  };
  return app;
}
module.exports = createApplication;

//路径参数 、article/:id/:name
//express子路由
//res封装
//模板渲染
