#!/usr/bin/env node
var cli = require('cli'),
    fs = require('fs'),
    indexEnv = require('./index-env.js'),
    cwd = process.cwd() + '/';

cli.width = 120;

var options = cli.parse({
    input: ['i', 'Path to index.ejs (relative to CWD).', 'path', 'index.ejs'],
    config: ['c', 'Path to directory with config.*.json files (relative to CWD).', 'path', 'config'],
    output: ['o', 'Path to output file (relative to CWD).', 'path', 'index.html']
});

indexEnv({
    inputFilePath: cwd + options.input,
    configFolderPath: cwd + options.config
}, function(err, result) {
    if (err) {
        return cli.fatal(err);
    }

    var outputFilePath = process.cwd() + '/' + (options.output || 'index.html');

    fs.writeFile(outputFilePath, result, function(err){
        if (err) {
            err.message = 'Error writing output file: ' + outputFilePath + '\n' + err.message;
            return cli.fatal(err);
        }

        cli.info('index-env completed successfully');
        process.exit();
    });
});

