define(['app'], function (_app) {
  'use strict';

  var _app2 = _interopRequireDefault(_app);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var angularModule = ['$scope'];
  angularModule.push(function (scope) {
    scope.test = {};
  });

  _app2.default.controller('homeController', angularModule);
});