module.exports = function(eE) {
    const eventEmitter = eE;

    function on(name, callback) {
        eventEmitter.on(name, callback);
    }

    function once(name, callback) {
        eventEmitter.once(name, callback);
    }

    return {
        on,
        once
    };
};