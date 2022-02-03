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
                writeEnd(response, 500, 'text/plain', null, 'an erorr occured');
            }

            if(pathname.endsWith('.ejs')) {
                const template = ejs.compile(html.toString());
                writeEnd(response, 200, 'text/html', template(data), null);
            }
            else if(pathname.endsWith('.pug')) {
                fn = pug.compile(html, {filename: `./views/${pathname}`, pretty: true});
                writeEnd(response, 200, 'text/html', fn(data), null);
            }
            else {
                writeEnd(response, 200, 'text/html', html, null);
            }

            eventEmitter.emit('render', { path: request.url, file: pathname });
        });
    } else {
        writeEnd(response, 404, 'text/plain', null, `Cannot ${request.method} ${request.url}`);
    }
}

function writeEnd(response, statusCode, contentType, write, end) {
    response.writeHead(statusCode, { 'Content-Type': contentType });
    if(write) response.write(write);
    response.end(end || null);
}

module.exports = {
    send,
    json,
    render,
    writeEnd
};