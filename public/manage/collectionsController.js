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
      scope.colIds = {};
      scope.indexes = {};
      scope.collections.forEach(function (col) {
        col.expanded = false;
        col.editName = col.name;
        scope.colIds[col.id] = col;
      });
    });

    scope.orderCollection = function (col) {
      return !col.isSystem + '_' + col.name;
    };

    scope.getFigures = scope.loadColDetails = function (col, open) {
      if (!open) return;

      if (col.status == 3) {
        http.get('/_db/' + params.currentDatabase + '/_api/collection/' + col.id + '/figures').then(function (data) {
          return Object.assign(scope.colIds[col.id], data.data);
        });
        http.get('/_db/' + params.currentDatabase + '/_api/index?collection=' + col.id).then(function (data) {
          return scope.indexes[col.id] = data.data.indexes;
        });
      }
    };

    scope.doAction = function (action, col) {
      if (col.status == 2 && action != 'load') return;
      console.log(action, col);
      var promise = undefined;

      switch (action) {
        case 'load':
          promise = http.put('/_db/' + params.currentDatabase + '/_api/collection/' + col.name + '/load', {
            count: false
          });
          break;

        case 'unload':
          promise = http.put('/_db/' + params.currentDatabase + '/_api/collection/' + col.name + '/unload');
          break;
      }

      promise.then(function (data) {
        console.log('promise resolved data', data);

        switch (action) {
          case 'load':
            messageBroker.pub('collections.reload');
            col.status = 3;
            scope.loadColDetails(col, true);
            break;

          case 'unload':
            col.status = 2;
            col.figures = {};
            delete scope.indexes[col.id];
            messageBroker.pub('collections.reload');
            break;
        }
      });
    };
  });

  _app2.default.controller('collectionsController', angularModule);
});