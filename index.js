const http = require('http');
const fs = require('fs');
const url = require('url');
const ev = require('events');
const eventEmitter = new ev.EventEmitter();

const ejs = require('ejs');
const pug = require('pug');

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

            response.send = (content) => responseFunctions.send(request, response, eventEmitter, content);
            response.json = (content) => responseFunctions.json(request, response, eventEmitter, content);
            response.render = (pathname, data) => responseFunctions.render(request, response, eventEmitter, pathname, data);

            if(routes.check(pathname, request, response, eventEmitter)) {}
            else if(await public(pathname, request, response, eventEmitter)) {}
            else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end(`Cannot ${request.method} ${pathname}`);

                eventEmitter.emit('404', { path: pathname });
            }

        }).listen(port);

        eventEmitter.emit('started', { port });

    } catch(error) {
        reject(error);
    }
}

module.exports = {
    init,
    on,
    once,
    get: routes.get,
    post: routes.post
};