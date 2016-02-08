define(['app'], function (_app) {
  'use strict';

  var _app2 = _interopRequireDefault(_app);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var angularModule = ['$http', '$q', 'messageBrokerService'];
  angularModule.push(function (http, q, messageBroker) {
    return {
      query: function query(_query) {
        var d = q.defer();
        console.log('AQL-QUERY', _query);
        http.post('/_db/' + messageBroker.last('current.database') + '/_api/cursor', {
          cache: false,
          query: _query
        }).then(function (data) {
          return d.resolve(data.data.result);
        });
        return d.promise;
      }
    };
  });

  _app2.default.service('queryService', angularModule);
});