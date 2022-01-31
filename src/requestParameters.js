const url = require('url');

module.exports = function(request) {
    request.query = url.parse(request.url, true).query;

    // Post body
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
};