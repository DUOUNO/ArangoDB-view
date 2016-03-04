/***
 * (c) 2016 by duo.uno
 *
 ***/

import app from 'app'


let angularModule = ['$scope', '$http', '$routeParams', '$timeout'];

angularModule.push((scope, http, params, timeout) => {

  console.log('init aqlController');

  let collections = [];
  let options     = {eval:'blur', max:1000};
  let curTimeout  = undefined;

  scope.queryResult = '';
  scope.lastError   = '';

  http.get(`/_db/${params.currentDatabase}/_api/collection`).then(data => collections = data.data.collections.map((col) => col.name) );


  let words = ['LET', 'IN', 'RETURN', 'TO_NUMBER', 'TO_STRING', 'IS_NULL', 'NOT_NULL', 'FILTER', 'FOR'];

  $('TEXTAREA#aqlEditor').on('keydown', (ev) => {
    if(ev.keyCode != 13) return;

    return

    // check if we can expand txt

    let txt  = $('TEXTAREA#aqlEditor').val();
    let sPos = $('TEXTAREA#aqlEditor').prop('selectionStart');
    let ePos = $('TEXTAREA#aqlEditor').prop('selectionEnd');

    if (sPos == ePos) return

    let partText = txt.slice(sPos, ePos);
    if(~partText.search(/\s/)) return;

    let i = sPos-1;
    while(txt[i]) {
      if(0 == txt[i].search(/\s/)) break;
      partText = txt[i] + partText;
      i--;
    }
    let ssPos = sPos - (sPos - i) + 1;

    i = ePos;
    while(txt[i]) {
      if(0 == txt[i].search(/\s/)) break;
      partText = partText + txt[i];
      i++;
    }

    console.log('PARTTEXT', [partText]);

    if(~words.indexOf(partText.toUpperCase())) {
      $('TEXTAREA#aqlEditor').val( txt.slice(0, ssPos) + partText.toUpperCase() + txt.slice(ePos) );
      $('TEXTAREA#aqlEditor').prop('selectionStart', ePos);
      $('TEXTAREA#aqlEditor').prop('selectionEnd', ePos);
    }





    // check if word expansion


    // how to?
     // from selection to right unit \n xor space 


    console.log(ev);
    // ev.stopPropagation();
    // ev.stopImmediatePropagation();
    ev.preventDefault();
  });

  $('TEXTAREA#aqlEditor').on('blur', (ev) => sendAqlQuery($('TEXTAREA#aqlEditor').val()) );


  $('TEXTAREA#aqlEditor').on('keyup', (ev) => {
    let txt       = $('TEXTAREA#aqlEditor').val();
    let txtArr    = txt.split('\n');
    let pos       = $('TEXTAREA#aqlEditor').prop('selectionStart');
    let ePos      = $('TEXTAREA#aqlEditor').prop('selectionEnd');

    // fooo


    scope.evalOptions(txtArr[0]);

    if (options.eval === 'asap') {
      sendAqlQuery(txt);
    } else if( ! isNaN(options.eval)) {
      timeout.cancel(curTimeout);

      curTimeout = timeout( () => {sendAqlQuery(txt); }, options.eval);
    } // if

    return



    if(~[8, 37, 38, 39, 40].indexOf(ev.keyCode)) return;
    console.log('-------------------------------', ev);


    console.log('after end is:', [txt[ePos]]);
    if(txt[ePos] && !~txt[ePos].search(/\s/)) return;

    let before = txt.slice(0,pos), 
        after = txt.slice(pos);
    let beforeArray = before.split(' ');
    let afterArray  = after.split(' ');

    console.log('beforeArray afterArray');
    console.log(beforeArray);
    console.log(afterArray);

    let beforeFirst = beforeArray.slice(-1).pop();
    let afterFirst  = afterArray.slice(0,1).pop();

    let i = pos-1, partText = txt.slice(pos, ePos);;
    while(txt[i]) {
      if(0 == txt[i].search(/\s/)) break;
      partText = txt[i] + partText;
      i--;
    }

    i = ePos;
    while(txt[i]) {
      if(0 == txt[i].search(/\s/)) break;
      partText = partText + txt[i];
      i++;
    }

    let cursorWord = partText;

    console.log('cursorWord is', [cursorWord]);

    console.log('beforeFirst afterFirst', [beforeFirst, afterFirst]);

    if(beforeFirst.length) {
      // check first if cursor word matches
      let noMatch = true;
      for(let word of words) {
        if(word.toLowerCase() != cursorWord.toLowerCase()) continue
        noMatch = false;
        break;
      } // for

      if(noMatch) {
        for(let word of words) {
                // if (word.toLowerCase() == beforeFirst.toLowerCase()) continue;
                if(0 == word.toLowerCase().indexOf(beforeFirst.toLowerCase())) {
                  console.log('word match', word);

                  console.log('would insert', word.slice(beforeFirst.length));


                  let newStr = before + word.slice(beforeFirst.length) + after;
                  console.log('newstr', newStr);

                  $('TEXTAREA#aqlEditor').val(newStr);

                  $('TEXTAREA#aqlEditor').prop('selectionStart', pos);
                  $('TEXTAREA#aqlEditor').prop('selectionEnd', pos+ word.slice(beforeFirst.length).length );




                  break;
                }
              } // for   
      }
      
    } // if


    console.log(beforeFirst, before, after);




  });

  let sendAqlQuery = (txt) => {
    http.post(`/_db/${params.currentDatabase}/_api/cursor`, {
      batchSize: options.count, query:txt
    }).then( data => {
      scope.lastError = '';
      scope.queryResult = JSON.stringify(data.data.result, false, 2);
    }, (data) => scope.lastError = data.data.errorMessage);
  }

  scope.evalOptions = (optionLine) => {
    optionLine = optionLine.trim()
    let result = undefined
    if (! (result = optionLine.match(/\/\/\ *eval\:(asap|blur|\d+ms)\ +max\:(all|\d+)/))) return
    let [count, evl, ...rest] = result.reverse();
    if (0 === evl.search(/^\d+ms$/) ) evl = Number(evl.slice(0,-2));
    if (! isNaN(count)) count = Number(count);

    Object.assign(options, {count:count, eval:evl});
  }

  scope.$on('$destroy', () => $('TEXTAREA#aqlEditor').off('keyup', 'keydown', 'blur') );

});

app.controller('aqlController', angularModule);
