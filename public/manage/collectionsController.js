define(['app'], function (_app) {
  'use strict';

  var _app2 = _interopRequireDefault(_app);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var angularModule = ['$scope', '$http', '$routeParams', 'messageBrokerService', '$q'];
  angularModule.push(function (scope, http, params, messageBroker, q) {
    messageBroker.pub('current.collection', '');
    http.get('/_db/' + params.currentDatabase + '/_api/collection').then(function (data) {
      scope.collections = data.data.collections;
      var qs = scope.collections.map(function (col) {
        if (col.status == 3) {
          return http.get('/_db/' + params.currentDatabase + '/_api/collection/' + col.id + '/properties');
        } else {
          var d = q.defer();
          d.resolve({
            data: {}
          });
          return d.promise;
        }
      });
      q.all(qs).then(function (vals) {
        return vals.forEach(function (res, idx) {
          return Object.assign(scope.collections[idx], res.data);
        });
      });
    });

    scope.orderCollection = function (col) {
      return !col.isSystem + '_' + col.name;
    };
  });

  _app2.default.controller('collectionsController', angularModule);
});