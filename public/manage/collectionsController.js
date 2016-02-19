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
      scope.indexes = {};
      var qs = scope.collections.map(function (col) {
        col.expanded = false;
        col.editName = col.name;

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
      if (!open) return;

      if (col.status == 3) {
        http.get('/_db/' + params.currentDatabase + '/_api/collection/' + col.name + '/figures').then(function (data) {
          return scope.figures[col.id] = data.data.figures;
        });
        http.get('/_db/' + params.currentDatabase + '/_api/index?collection=' + col.id).then(function (data) {
          return scope.indexes[col.id] = data.data.indexes;
        });
      } else {
        scope.figures[col.id] = 'not loaded';
      }
    };

    scope.doAction = function (action) {
      console.log(action);
    };
  });

  _app2.default.controller('collectionsController', angularModule);
});