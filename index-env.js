var fs = require('fs'),
    ejs = require('ejs');

module.exports = function indexEnvDef(opts, cb) {
    var o = opts || {},
        env = process.env.NODE_ENV || 'development',
        inputFilePath = (o.inputFilePath || 'index.ejs'),
        configFolderPath = (o.configFolderPath || 'config') + '/',
        defaultConfigFilePath = configFolderPath + 'config.json';
        configFilePath = ((env && env !== 'development') ? configFolderPath + ('config.' + env + '.json') : defaultConfigFilePath);

    fs.exists(configFilePath, function(exists) {
        if (!exists) {
            if (configFilePath === defaultConfigFilePath) {
                var err = new Error('File ' + configFilePath + ' not found.');
                return cb(err);
            }
            configFilePath = defaultConfigFilePath;
        }

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
    });
};