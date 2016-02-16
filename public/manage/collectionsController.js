define(['app'], function (_app) {
  'use strict';

  var _app2 = _interopRequireDefault(_app);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var angularModule = ['$scope', '$http', '$routeParams', 'messageBrokerService', 'formatService', '$q'];
  angularModule.push(function (scope, http, params, messageBroker, formatService, q) {
    scope.format = formatService;
    scope.Number = Number;
    messageBroker.pub('current.collection', '');
    scope.indexBucketSizes = {};

    for (var i = 1; i <= 1024; i = i * 2) {
      scope.indexBucketSizes[i] = 1;
    }

    http.get('/_db/' + params.currentDatabase + '/_api/collection').then(function (data) {
      scope.collections = data.data.collections;
      scope.figures = {};
      var qs = scope.collections.map(function (col) {
        col.expanded = false;

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

    scope.getFigures = function (col, open) {
      if (col.status == 3) {
        http.get('/_db/' + params.currentDatabase + '/_api/collection/' + col.name + '/figures').then(function (data) {
          return scope.figures[col.name] = data.data.figures;
        });
      } else {
        scope.figures[col.name] = 'not loaded';
      }
    };
  });

  _app2.default.controller('collectionsController', angularModule);
});