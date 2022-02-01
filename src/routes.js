let routes = {};

function check(path, req, res, eventEmitter) {
    if(routes[path] && routes[path][req.method]) {
        emit(path, req, res, eventEmitter);
        return true;
    }
    return false;
}

function emit(path, req, res, eventEmitter) {
    routes[path][req.method](req, res);
    eventEmitter.emit(req.method.toLowerCase(), { path });
}

function get(path, callback) {
    if(!routes[path]) routes[path] = {};
    routes[path].GET = callback;
}

function post(path, callback) {
    if(!routes[path]) routes[path] = {};
    routes[path].POST = callback;
}

module.exports = {
    check,
    emit,
    get,
    post
};