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
        console.log('journalSize link init');
        if (!ngModel) return;
        console.log(ngModel);
        ngModel.$formatters.push(function (value) {
          if (!isNaN(value)) {
            console.log('format value', value);
            return value / 1000 / 1000;
          }
        });
        ngModel.$parsers.push(function (value) {
          console.log('parse value', value);
          return value * 1000 * 1000;
        });
      }
    };
  });

  _app2.default.directive('journalSize', angularDirective);
});