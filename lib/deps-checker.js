var utils = require('./utils');

function _checkDeps(files) {
    var _files = {};

    files.forEach(function (file) {
        _files.fullpath = file.fullpath.substring(0, file.fullpath.lastIndexOf('/'));
        _files.depsPath = file.name.substring(0, file.name.lastIndexOf(file.suffix)) + '.deps.js';

        if (file.suffix === '.deps.js') _files.deps = file;
        if (file.suffix === '.js') _files.js = file;
        if (file.suffix === '.bemhtml') _files.bemhtml = file;
    });

    /*jshint -W061 */
    var depsContent = _files.deps ? eval(_files.deps.content) : '',
        jsContent = _files.js ? _files.js.content : '',
        bemhtmlContent = _files.bemhtml ? _files.bemhtml.content : '';

    var actualDeps = utils.getActualDeps(depsContent),
        expectedDeps = utils.getExpectedDeps(jsContent, bemhtmlContent);

    var isEqual = utils.isEqual(actualDeps, expectedDeps);

    return !isEqual ? {
        fullpath: _files.deps ? _files.deps.fullpath : _files.fullpath,
        actualDeps: _files.deps ? actualDeps : 'No deps file ' + _files.depsPath,
        expectedDeps: expectedDeps
    } : {};
}

module.exports = {
    check: function (files) {
        var res = [];

        files.forEach(function (groupOfFiles) {
            var error = _checkDeps(groupOfFiles);

            Object.keys(error).length && res.push(error);
        });

        return res;
    }
};