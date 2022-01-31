const http = require('http');
const fs = require('fs');
const mime = require('mime');
const url = require('url');

const ejs = require('ejs');
const pug = require('pug');

const events = require('events');
const eventEmitter = new events.EventEmitter();

var routes = {};

function init(port) {
    return new Promise((resolve, reject) => {
        try {
            http.createServer(async function (request, response) {
                request.post = new Promise((resolve, reject) => {
                    if(request.method == 'POST') {
                        var body = '';
                        request.on('data', function(data) {
                            body += data;
                        });
                        request.on('end', function() {
                            const singles = body.split('&');
                            body = {};
                            singles.forEach(single => {
                                const [key, value] = single.split('=');
                                body[key] = value;
                            });
                            resolve(body);
                        });
                    }
                });





                const { pathname, query } = url.parse(request.url, true);
                
                eventEmitter.emit('request', { path: request.url });

                request.query = query;
                response.send = function(content) {
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.end(content);

                    eventEmitter.emit('send', { path: request.url });
                };
                response.json = function(content) {
                    response.writeHead(200, { 'Content-Type': 'text/json' });
                    response.end(JSON.stringify(content));

                    eventEmitter.emit('json', { path: request.url });
                };
                response.render = function(pathname, data) {
                    if(fs.existsSync(`./views/${pathname}`)) {
                        fs.readFile(`./views/${pathname}`, function (err, html) {
                            if(err) {
                                response.writeHead(200, { 'Content-Type': 'text/plain' });
                                response.end('an erorr occured');
                            }

                            if(pathname.endsWith('.ejs')) {
                                response.writeHead(200, { 'Content-Type': 'text/html' });

                                const template = ejs.compile(html.toString());
                                response.write(template(data));
                                response.end();
                            }
                            else if(pathname.endsWith('.pug')) {
                                response.writeHead(200, { 'Content-Type': 'text/html' });

                                fn = pug.compile(html, {filename: `./views/${pathname}`, pretty: true});
                                response.write(fn(data));
                                response.end();
                            }
                            else {
                                response.writeHead(200, { 'Content-Type': 'text/html' });
                                
                                response.write(html);
                                response.end();
                            }

                            eventEmitter.emit('render', { path: request.url, file: pathname });
                        });
                    } else {
                        response.writeHead(404, { 'Content-Type': 'text/plain' });
                        response.end(`Cannot ${request.method} ${request.url}`);
                    }
                };


                //? If path exists as route
                if(routes[pathname] && routes[pathname].method === request.method) {
                    routes[pathname].callback(request, response);
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

function post(path, callback) {
    routes[path] = {
        method: 'POST',
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
    get,
    post
};