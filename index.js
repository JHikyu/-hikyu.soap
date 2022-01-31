const http = require('http');
const fs = require('fs');
const url = require('url');
const ev = require('events');
const eventEmitter = new ev.EventEmitter();

const ejs = require('ejs');
const pug = require('pug');
const mime = require('mime');

const { on, once } = require('./src/events')(eventEmitter); // Event listeners
const routes = require('./src/routes'); // Routes
const responseFunctions = require('./src/responseFunctions');
const requestParameters = require('./src/requestParameters');
const { readFileData } = require('./src/misc')(fs); // Misc

function init(port) {
    return new Promise((resolve, reject) => {
        try {
            http.createServer(async function (request, response) {  
                const { pathname } = url.parse(request.url, true);
                eventEmitter.emit('request', { path: pathname });

                // Get query / Post body
                requestParameters(request);

                // Create functions for the user
                responseFunctions(request, response, eventEmitter);

                //? If path exists as route
                if(routes.check(pathname, request, response)) {

                }

                //? If path exists in public
                else if(fs.existsSync(`./public${pathname}`)) {
                    const data = await readFileData(pathname);
                    
                    response.writeHead(200, { 'Content-Type': mime.getType(`./public${pathname}`) });
                    response.end(data);

                    eventEmitter.emit('load', { path: pathname, 'Content-Type': mime.getType(`./public${pathname}`) });
                }

                //? If none of these exist
                else {
                    response.writeHead(404, { 'Content-Type': 'text/plain' });
                    response.end(`Cannot ${request.method} ${pathname}`);

                    eventEmitter.emit('404', { path: pathname });
                }

            }).listen(port);
            eventEmitter.emit('started', { port });
            resolve(port);
        } catch(error) {
            reject(error);
        }
    });
}




module.exports = {
    init,
    on,
    once,
    get: routes.get,
    post: routes.post
};