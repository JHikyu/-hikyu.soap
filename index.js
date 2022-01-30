const http = require('http');
const fs = require('fs');
const mime = require('mime');
const { callbackify } = require('util');





module.exports = {
    init
};

function init(port) {
    return new Promise((resolve, reject) => {
        try {
            http.createServer(async function (request, response) {
                if(fs.existsSync(`./public${request.url}`)) {
                    const data = await readFileData(request.url);
                    
                    response.writeHead(200, { 'Content-Type': mime.getType(`./public${request.url}`) });
                    response.end(data);
                }
                else {
                    //? Routes here
                    // response.writeHead(200, { 'Content-Type': 'text/html' });
                    // response.end('Hello World\n');
                }
            }).listen(port);
            resolve({ port });
        } catch (error) {
            reject(error);
        }
    });
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
