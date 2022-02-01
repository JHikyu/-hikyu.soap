const fs = require('fs');

const pug = require('pug');
const ejs = require('ejs');

function send(request, response, eventEmitter, content) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(content);

    eventEmitter.emit('send', { path: request.url });
}

function json(request, response, eventEmitter, content) {
    response.writeHead(200, { 'Content-Type': 'text/json' });
    response.end(JSON.stringify(content));

    eventEmitter.emit('json', { path: request.url });
}
function render(request, response, eventEmitter, pathname, data) {
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
}

module.exports = {
    send,
    json,
    render
};