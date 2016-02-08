define(['app'], function (_app) {
  'use strict';

  var _app2 = _interopRequireDefault(_app);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var angularModule = ['$scope', '$routeParams', '$http', 'messageBrokerService', 'queryService', 'formatService', 'testService'];
  angularModule.push(function (scope, params, http, messageBroker, query, format) {
    scope.format = format;
    messageBroker.pub('current.collection', params.collectionName);
    scope.params = params;
    var from = scope.from = Number(params.from);
    var to = scope.to = Number(params.to);
    scope.batchSize = to - from + 1;
    scope.docs = [];
    http.get('/_db/' + messageBroker.last('current.database') + '/_api/collection/' + params.collectionName + '/count').then(function (data) {
      console.log(scope.collectionInfo = data.data);
      messageBroker.pub('collections.reload');
      var pages = Math.ceil(scope.collectionInfo.count / scope.batchSize);
      var curpage = from / scope.batchSize + 1;
      var left = curpage - 1;
      var right = pages - curpage;
      var arr = [];
      arr.push(curpage);

      for (var i = 1; i <= 3; i++) {
        if (left - i >= 0) {
          arr.unshift(curpage - i);
        }

        if (right - i >= 0) {
          arr.push(curpage + i);
        }
      }

      var attrLength = Math.floor(arr.length / 2);

      for (var i = 2; i < right - attrLength && i < 20; i++) {
        var n = curpage + Math.round(Math.pow(Math.E, i));
        if (n >= pages) break;
        arr.push(n);
      }

      for (var i = 2; i < left - attrLength && i < 20; i++) {
        var n = curpage - Math.round(Math.pow(Math.E, i));
        if (n < 2) break;
        arr.unshift(n);
      }

      if (attrLength < right && -1 == arr.indexOf(pages)) arr.push(pages);
      if (attrLength < left && -1 == arr.indexOf(1)) arr.unshift(1);
      scope.pages = arr;
      query.query('for doc in ' + params.collectionName + ' let attr = slice(attributes(doc), 0, 20)  limit ' + params.from + ',' + scope.batchSize + ' return keep(doc, attr)').then(function (results) {
        scope.docs = results;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = scope.docs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var doc = _step.value;
            delete doc._rev;
            delete doc._id;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });
    });
  });

  _app2.default.controller('collectionController', angularModule);
});