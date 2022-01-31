module.exports = function(fs) {

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

    return {
        readFileData
    };
};