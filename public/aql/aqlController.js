define(['app'], function (_app) {
  'use strict';

  var _app2 = _interopRequireDefault(_app);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  var angularModule = ['$scope', '$http', '$routeParams', '$timeout'];
  angularModule.push(function (scope, http, params, timeout) {
    console.log('init aqlController');
    var collections = [];
    var options = {
      eval: 'blur',
      max: 1000
    };
    var curTimeout = undefined;
    scope.queryResult = '';
    scope.lastError = '';
    http.get('/_db/' + params.currentDatabase + '/_api/collection').then(function (data) {
      return collections = data.data.collections.map(function (col) {
        return col.name;
      });
    });
    var words = ['LET', 'IN', 'RETURN', 'TO_NUMBER', 'TO_STRING', 'IS_NULL', 'NOT_NULL', 'FILTER', 'FOR'];
    $('TEXTAREA#aqlEditor').on('keydown', function (ev) {
      if (ev.keyCode != 13) return;
      return;
      var txt = $('TEXTAREA#aqlEditor').val();
      var sPos = $('TEXTAREA#aqlEditor').prop('selectionStart');
      var ePos = $('TEXTAREA#aqlEditor').prop('selectionEnd');
      if (sPos == ePos) return;
      var partText = txt.slice(sPos, ePos);
      if (~partText.search(/\s/)) return;
      var i = sPos - 1;

      while (txt[i]) {
        if (0 == txt[i].search(/\s/)) break;
        partText = txt[i] + partText;
        i--;
      }

      var ssPos = sPos - (sPos - i) + 1;
      i = ePos;

      while (txt[i]) {
        if (0 == txt[i].search(/\s/)) break;
        partText = partText + txt[i];
        i++;
      }

      console.log('PARTTEXT', [partText]);

      if (~words.indexOf(partText.toUpperCase())) {
        $('TEXTAREA#aqlEditor').val(txt.slice(0, ssPos) + partText.toUpperCase() + txt.slice(ePos));
        $('TEXTAREA#aqlEditor').prop('selectionStart', ePos);
        $('TEXTAREA#aqlEditor').prop('selectionEnd', ePos);
      }

      console.log(ev);
      ev.preventDefault();
    });
    $('TEXTAREA#aqlEditor').on('blur', function (ev) {
      return sendAqlQuery($('TEXTAREA#aqlEditor').val());
    });
    $('TEXTAREA#aqlEditor').on('keyup', function (ev) {
      var txt = $('TEXTAREA#aqlEditor').val();
      var txtArr = txt.split('\n');
      var pos = $('TEXTAREA#aqlEditor').prop('selectionStart');
      var ePos = $('TEXTAREA#aqlEditor').prop('selectionEnd');
      scope.evalOptions(txtArr[0]);

      if (options.eval === 'asap') {
        sendAqlQuery(txt);
      } else if (!isNaN(options.eval)) {
        timeout.cancel(curTimeout);
        curTimeout = timeout(function () {
          sendAqlQuery(txt);
        }, options.eval);
      }

      return;
      if (~[8, 37, 38, 39, 40].indexOf(ev.keyCode)) return;
      console.log('-------------------------------', ev);
      console.log('after end is:', [txt[ePos]]);
      if (txt[ePos] && ! ~txt[ePos].search(/\s/)) return;
      var before = txt.slice(0, pos),
          after = txt.slice(pos);
      var beforeArray = before.split(' ');
      var afterArray = after.split(' ');
      console.log('beforeArray afterArray');
      console.log(beforeArray);
      console.log(afterArray);
      var beforeFirst = beforeArray.slice(-1).pop();
      var afterFirst = afterArray.slice(0, 1).pop();
      var i = pos - 1,
          partText = txt.slice(pos, ePos);
      ;

      while (txt[i]) {
        if (0 == txt[i].search(/\s/)) break;
        partText = txt[i] + partText;
        i--;
      }

      i = ePos;

      while (txt[i]) {
        if (0 == txt[i].search(/\s/)) break;
        partText = partText + txt[i];
        i++;
      }

      var cursorWord = partText;
      console.log('cursorWord is', [cursorWord]);
      console.log('beforeFirst afterFirst', [beforeFirst, afterFirst]);

      if (beforeFirst.length) {
        var noMatch = true;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = words[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var word = _step.value;
            if (word.toLowerCase() != cursorWord.toLowerCase()) continue;
            noMatch = false;
            break;
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

        if (noMatch) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = words[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var word = _step2.value;

              if (0 == word.toLowerCase().indexOf(beforeFirst.toLowerCase())) {
                console.log('word match', word);
                console.log('would insert', word.slice(beforeFirst.length));
                var newStr = before + word.slice(beforeFirst.length) + after;
                console.log('newstr', newStr);
                $('TEXTAREA#aqlEditor').val(newStr);
                $('TEXTAREA#aqlEditor').prop('selectionStart', pos);
                $('TEXTAREA#aqlEditor').prop('selectionEnd', pos + word.slice(beforeFirst.length).length);
                break;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      }

      console.log(beforeFirst, before, after);
    });

    var sendAqlQuery = function sendAqlQuery(txt) {
      http.post('/_db/' + params.currentDatabase + '/_api/cursor', {
        batchSize: options.count,
        query: txt
      }).then(function (data) {
        scope.lastError = '';
        scope.queryResult = JSON.stringify(data.data.result, false, 2);
      }, function (data) {
        return scope.lastError = data.data.errorMessage;
      });
    };

    scope.evalOptions = function (optionLine) {
      optionLine = optionLine.trim();
      var result = undefined;
      if (!(result = optionLine.match(/\/\/\ *eval\:(asap|blur|\d+ms)\ +max\:(all|\d+)/))) return;

      var _result$reverse = result.reverse();

      var _result$reverse2 = _toArray(_result$reverse);

      var count = _result$reverse2[0];
      var evl = _result$reverse2[1];

      var rest = _result$reverse2.slice(2);

      if (0 === evl.search(/^\d+ms$/)) evl = Number(evl.slice(0, -2));
      if (!isNaN(count)) count = Number(count);
      Object.assign(options, {
        count: count,
        eval: evl
      });
    };

    scope.$on('$destroy', function () {
      return $('TEXTAREA#aqlEditor').off('keyup', 'keydown', 'blur');
    });
  });

  _app2.default.controller('aqlController', angularModule);
});