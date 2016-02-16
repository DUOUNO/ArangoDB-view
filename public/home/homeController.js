define(['app'], function (_app) {
  'use strict';

  var _app2 = _interopRequireDefault(_app);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var angularModule = ['$scope', '$http'];
  angularModule.push(function (scope, http) {
    console.log('init homeController');
    scope.test = {};
    scope.changelog = '';
    http.get('/_db/_system/_api/version').then(function (data) {
      var version = data.data.version;

      if (0 == version.search(/^\d\.\d\.\d$/)) {
        version = version.split('.').slice(0, 2).join('.');
      }

      http.get('https://raw.githubusercontent.com/arangodb/arangodb/' + version + '/CHANGELOG').then(function (data) {
        return scope.changelog = data.data;
      });
    });
  });

  _app2.default.controller('homeController', angularModule);
});