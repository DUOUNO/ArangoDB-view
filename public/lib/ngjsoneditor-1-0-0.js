/*
Licence
The Artistic License 2.0: see LICENSE.md
*/

(function () {
    var module = angular.module('ng.jsoneditor', []);
    module.constant('ngJsoneditorConfig', {});

    module.directive('ngJsoneditor', ['ngJsoneditorConfig', '$timeout', function (ngJsoneditorConfig, $timeout) {
        var defaults = ngJsoneditorConfig || {};

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {'options': '=', 'ngJsoneditor': '=', 'preferText': '='},
            link: function ($scope, element, attrs, ngModel) {
                var debounceTo, debounceFrom;
                var editor;
                var internalTrigger = false;

                if (!angular.isDefined(window.JSONEditor)) {
                    throw new Error("Please add the jsoneditor.js script first!");
                }

                function _createEditor(options) {
                    var settings = angular.extend({}, defaults, options);
                    var theOptions = angular.extend({}, settings, {
                        change: function () {
                            if (typeof debounceTo !== 'undefined') {
                                $timeout.cancel(debounceTo);
                            }

                            debounceTo = $timeout(function () {
                                if (editor) {
                                    internalTrigger = true;
                                    var error = undefined;
                                    try {
                                        ngModel.$setViewValue($scope.preferText === true ? editor.getText() : editor.get());
                                    }
                                    catch(e){
                                        error = e;
                                    }
                                    internalTrigger = false;

                                    if (settings && settings.hasOwnProperty('change')) {
                                        settings.change(error);
                                    }
                                }
                            }, settings.timeout || 100);
                        }
                    });

                    element.html('');

                    var instance = new JSONEditor(element[0], theOptions);

                    if ($scope.ngJsoneditor instanceof Function) {
                        $timeout(function () { $scope.ngJsoneditor(instance);});
                    }

                    return instance;
                }

                $scope.$watch('options', function (newValue, oldValue) {
                    for (var k in newValue) {
                        if (newValue.hasOwnProperty(k)) {
                            var v = newValue[k];

                            if (newValue[k] !== oldValue[k]) {
                                if (k === 'mode') {
                                    editor.setMode(v);
                                } else if (k === 'name') {
                                    editor.setName(v);
                                } else { //other settings cannot be changed without re-creating the JsonEditor
                                    editor = _createEditor(newValue);
                                    $scope.updateJsonEditor();
                                    return;
                                }
                            }
                        }
                    }
                }, true);

                $scope.$on('$destroy', function () {
                    //remove jsoneditor?
                });

                $scope.updateJsonEditor = function (newValue) {
                    if (internalTrigger) return; //ignore if called by $setViewValue

                    if (typeof debounceFrom !== 'undefined') {
                        $timeout.cancel(debounceFrom);
                    }

                    debounceFrom = $timeout(function () {
                        if (($scope.preferText === true) && !angular.isObject(ngModel.$viewValue)) {
                            editor.setText(ngModel.$viewValue || '{}');
                        } else {
                            editor.set(ngModel.$viewValue || {});
                        }
                    }, $scope.options.timeout || 100);
                };

                editor = _createEditor($scope.options);

                if ($scope.options.hasOwnProperty('expanded')) {
                    $timeout($scope.options.expanded ? function () {editor.expandAll()} : function () {editor.collapseAll()}, ($scope.options.timeout || 100) + 100);
                }

                ngModel.$render = $scope.updateJsonEditor;
                $scope.$watch(function () { return ngModel.$modelValue; }, $scope.updateJsonEditor, true); //if someone changes ng-model from outside
            }
        };
    }]);
})();