const http = require('http');
const fs = require('fs');
const mime = require('mime');

const events = require('events');
const eventEmitter = new events.EventEmitter();

var routes = {};

function init(port) {
    return new Promise((resolve, reject) => {
        try {
            http.createServer(async function (request, response) {
                response.send = function(content) {
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.end(content);
                };
                response.render = function(path, data) {
                    if(fs.existsSync(`./views/${path}`)) {
                        fs.readFile(`./views/${path}`, function (err, html) {
                            if(err) {
                                response.writeHead(200, { 'Content-Type': 'text/plain' });
                                response.end('an erorr occured');
                            }
                            response.writeHead(200, { 'Content-Type': 'text/html' });
                            response.write(html);  
                            response.end();  
                        });
                    } else {
                        response.writeHead(404, { 'Content-Type': 'text/plain' });
                        response.end('not found');
                    }
                };


                //? If path exists as route
                if(routes[request.url] && routes[request.url].method === request.method) {
                    
                    console.log(routes[request.url]);
                    routes[request.url].callback(request, response);
                }


                //? If path exists in public
                else if(fs.existsSync(`./public${request.url}`)) {
                    const data = await readFileData(request.url);
                    
                    response.writeHead(200, { 'Content-Type': mime.getType(`./public${request.url}`) });
                    response.end(data);
                }

                else {
                    response.writeHead(404, { 'Content-Type': 'text/plain' });
                    response.end('not found');
                }

            }).listen(port);
            eventEmitter.emit('started', { port });
            resolve(port);
        } catch (error) {
            reject(error);
        }
    });
}

function on(name, callback) {
    eventEmitter.on(name, callback);
}
function once(name, callback) {
    eventEmitter.once(name, callback);
}

function get(path, callback) {
    routes[path] = {
        method: 'GET',
        callback
    };
}



async function readFileData(path) {
    return new Promise((resolve, reject) => {
        try {
            const file = fs.readFile(`./public${path}`, (err, data) => {
                resolve(data);
            });
        } catch (error) {
            reject(error);
        }
    });

}

module.exports = {
    init,
    on,
    once,
    get
};