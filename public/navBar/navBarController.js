define(['app'], function (_app) {
  'use strict';

  var _app2 = _interopRequireDefault(_app);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var stat = 'LET r = (FOR d IN _statistics sort d.time desc limit @time RETURN d)\nlet x = MERGE(FOR t IN [\'http\', \'client\', \'system\']\nlet z = MERGE(FOR a IN ATTRIBUTES(r[0][t])\nfilter !CONTAINS(a, \'Percent\')\nRETURN {[a]: sum(r[*][t][a]) / @time})\nRETURN {[t]:z}) RETURN x';
  var angularModule = ['$scope', '$http', '$interval', 'formatService', 'messageBrokerService'];
  angularModule.push(function (scope, http, interval, format, messageBroker) {
    scope.format = format;
    scope.collectionsBarStatus = 1;

    scope.changeCollectionsBarStatus = function () {
      scope.collectionsBarStatus++;
      if (scope.collectionsBarStatus > 1) scope.collectionsBarStatus = 0;
      messageBroker.pub('collectionsbar.status', scope.collectionsBarStatus);
    };

    http.get('/_db/_system/_api/version').then(function (data) {
      return scope.cfg.arango = data.data;
    });
    http.get('/_api/database').then(function (data) {
      return scope.cfg.dbs = data.data.result;
    });
    scope.cfg = {};
    scope.cfg.arango = 'n/a';
    scope.cfg.dbs = ['_system'];
    scope.cfg.selectedDb = '_system';
    scope.cfg.collections = [];

    scope.loadCollectionsInfo = function () {
      http.get('/_db/' + scope.cfg.selectedDb + '/_api/collection').then(function (data) {
        scope.cfg.collections = data.data.collections;
        messageBroker.pub('current.database', scope.cfg.selectedDb);
        messageBroker.pub('collections', scope.cfg.collections);
      });
    };

    scope.loadCollectionsInfo();

    scope.loadCollectionInfo = function () {
      if (!scope.cfg.selectedCollection) return;
      http.get('/_db/' + scope.cfg.selectedDb + '/_api/collection/' + scope.cfg.selectedCollection.name + '/count').then(function (data) {
        return console.log(scope.cfg.selectedCollectionInfo = data.data);
      });
    };

    scope.groupCollections = function (collection) {
      if (collection.isSystem) {
        return 'system collections';
      } else {
        return 'user collections';
      }
    };

    scope.refreshStats = function () {
      http.post('/_db/_system/_api/cursor', {
        cache: false,
        query: stat,
        bindVars: {
          time: 6
        }
      }).then(function (data) {
        return scope.cfg.stats = data.data.result[0];
      });
    };

    scope.refreshStats();
    interval(scope.refreshStats, 10 * 1000);
    messageBroker.sub('collections.reload', scope);
    scope.$on('collections.reload', function () {
      return scope.loadCollectionsInfo();
    });
  });

  _app2.default.controller('navBarController', angularModule);
});