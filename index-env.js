var fs = require('fs'),
    ejs = require('ejs');

module.exports = function indexEnvDef(opts, cb) {
    var o = opts || {},
        env = process.env.NODE_ENV || 'development',
        inputFilePath = (o.inputFilePath || 'index.ejs'),
        configFolderPath = (o.configFolderPath || 'config') + '/',
        configFilePath = configFolderPath + ((env && env !== 'development') ? 'config.' + env + '.json' : 'config.json');

    fs.readFile(configFilePath, function(err, result) {
        var config;

        if (err) {
            err.message = 'Reading config file: ' + configFilePath + '\n' + err.message;
            return cb(err);
        }

        try {
            config = JSON.parse(result);
        } catch(err) {
            err.message = 'Parsing config file: ' + configFilePath + '\n' + err.message;
            return cb(err);
        }

        ejs.renderFile(inputFilePath, { config: config }, function(err,result) {
            if (err) {
                err.message = 'Rendering input file: ' + inputFilePath + '\n' + err.message;
                return cb(err);
            }
            cb(null, result);
        });
    });
};