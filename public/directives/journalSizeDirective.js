define(['app'], function (_app) {
  'use strict';

  var _app2 = _interopRequireDefault(_app);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var angularDirective = [];
  angularDirective.push(function () {
    return {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        base: '@'
      },
      link: function link(scope, element, attrs, ngModel) {
        if (!ngModel) return;
        ngModel.$formatters.push(function (value) {
          if (!isNaN(value)) {
            if (scope.base == '10') return value / 1000 / 1000;else return value / 1024 / 1024;
          }
        });
        ngModel.$parsers.push(function (value) {
          if (isNaN(value)) return;
          if (scope.base == '10') return value * 1000 * 1000;else return value * 1024 * 1024;
        });
      }
    };
  });

  _app2.default.directive('journalSize', angularDirective);
});