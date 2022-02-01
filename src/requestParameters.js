const url = require('url');

const query = (request) => url.parse(request.url, true).query;
const post = (request) => new Promise((resolve, reject) => {
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
    else
        resolve({});
});

module.exports = {
    query,
    post
};