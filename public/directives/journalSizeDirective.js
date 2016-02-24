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
        listenTo: '@test'
      },
      link: function link(scope, element, attrs, ngModel) {
        if (!ngModel) return;
        console.log(ngModel);
        ngModel.$formatters.push(function (value) {
          if (!isNaN(value)) {
            return value / 1000 / 1000;
          }
        });
        ngModel.$parsers.push(function (value) {
          if (isNaN(value)) return;
          return value * 1000 * 1000;
        });
      }
    };
  });

  _app2.default.directive('journalSize', angularDirective);
});