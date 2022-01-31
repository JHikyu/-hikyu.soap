let routes = {};

function check(path, req, res) {
    if(routes[path] && routes[path].method === req.method) {
        emit(path, req, res);
        return true;
    }
    return false;
}

function emit(path, req, res) {
    routes[path].callback(req, res);
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

module.exports = {
    check,
    emit,
    get,
    post
};