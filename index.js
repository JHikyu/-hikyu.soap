const http = require('http');
const url = require('url');
const ev = require('events');
const eventEmitter = new ev.EventEmitter();

const { on, once } = require('./src/events')(eventEmitter); // Event listeners
const routes = require('./src/routes'); // Routes
const responseFunctions = require('./src/responseFunctions');
const requestParameters = require('./src/requestParameters');
const public = require('./src/public');

function init(port) {
  try {
    http.createServer(async function (request, response) {
      const { pathname } = url.parse(request.url, true);
      eventEmitter.emit('request', { path: pathname });

      request.query = requestParameters.query(request);
      request.post = await requestParameters.post(request);
      request.get = request.query;
      request.body = request.post;

      response.send = (content) => responseFunctions.send(request, response, eventEmitter, content);
      response.json = (content) => responseFunctions.json(request, response, eventEmitter, content);
      response.render = (pathname, data) => responseFunctions.render(request, response, eventEmitter, pathname, data);

      if (routes.check(pathname, request, response, eventEmitter)) { }
      else if (responseFunctions.smartRoutingOptions.enabled && responseFunctions.smartRoutingGet(pathname, request, response, eventEmitter)) { }
      else if (await public(pathname, request, response, eventEmitter)) { }
      else {
        responseFunctions.writeEnd(response, 404, 'text/plain', null, `Cannot ${request.method} ${pathname}`);
        eventEmitter.emit('404', { path: pathname });
      }

    }).listen(port);

    eventEmitter.emit('started', { port });
    eventEmitter.emit('init', { port });

  } catch (error) {
    reject(error);
  }
}

module.exports = {
  init,
  on,
  once,
  get: routes.get,
  post: routes.post,
  put: routes.put,
  delete: routes.delete,
  smartRouting: responseFunctions.smartRouting,
};

