const fs = require('fs');
const { readFileData } = require('./misc')(fs); // Misc
const mime = require('mime');

module.exports = async function(pathname, request, response, eventEmitter) {
    if(fs.existsSync(`./public${pathname}`)) {
        const data = await readFileData(pathname);
        
        response.writeHead(200, { 'Content-Type': mime.getType(`./public${pathname}`) });
        response.end(data);
    
        eventEmitter.emit('load', { path: pathname, 'Content-Type': mime.getType(`./public${pathname}`) });

        return true;
    }
    return false;
};