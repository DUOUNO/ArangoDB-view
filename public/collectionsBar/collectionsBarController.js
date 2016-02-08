define(['app'], function (_app) {
  'use strict';

  var _app2 = _interopRequireDefault(_app);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var angularModule = ['$scope', '$http', '$interval', 'messageBrokerService'];
  angularModule.push(function (scope, http, interval, messageBroker) {
    console.log('define collectionsBarController');
    messageBroker.sub('collectionsbar.status collections current.collection', scope);
    scope.cfg = {};
    scope.status = 1;
    scope.collections = [];
    scope.currentCollection = '';
    scope.$on('collectionsbar.status', function (e, status) {
      console.log(scope.status = status);
    });

    scope.setCurrentCollection = function () {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = scope.collections[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var col = _step.value;

          if (col.name == scope.currentCollection) {
            col.current = true;
          } else col.current = false;
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
    };

    scope.$on('collections', function (event, collections) {
      scope.collections = collections;
      scope.setCurrentCollection();
    });
    scope.$on('current.collection', function (e, currentCollection) {
      scope.currentCollection = currentCollection;
      scope.setCurrentCollection();
    });
  });

  _app2.default.controller('collectionsBarController', angularModule);
});