var indexEnv = require('./index-env.js');

module.exports = {
    indexEnv: indexEnv,
    middleware: function indexEnvMiddlewareCreator(opts) {
        return function indexEnvMiddleware(req, res, next) {
            indexEnv(opts, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).type('html').end(result);
            })
        }
    }
};