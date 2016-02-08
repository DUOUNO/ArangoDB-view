define(['app'], function (_app) {
  'use strict';

  var _app2 = _interopRequireDefault(_app);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var angularModule = ['$scope', '$routeParams', '$http', '$location', 'queryService', '$route'];
  angularModule.push(function (scope, params, http, location, query, route) {
    console.log('init documentRouteController');
    var from = Number(params.from);
    var index = Number(params.index);
    query.query('for doc in ' + params.collectionName + ' limit ' + (from + index) + ',1 return doc._key').then(function (result) {
      console.log(location.path());
      location.path(location.path() + '/document/' + result[0]);
    });
  });

  _app2.default.controller('documentRouteController', angularModule);
});