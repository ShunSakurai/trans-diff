(function() {

// Created the favicon on https://favicon.io/favicon-generator/
let faviconLink = document.createElement('link');
faviconLink.href = 'images/favicon.ico';
faviconLink.rel = 'icon';
faviconLink.type = 'image/x-icon';
document.head.appendChild(faviconLink);

const drag1 = document.getElementById('drag1');
const drag2 = document.getElementById('drag2');
const filename1 = document.getElementById('filename1');
const filename2 = document.getElementById('filename2');
const fileinput1 = document.getElementById('fileinput1');
const fileinput2 = document.getElementById('fileinput2');
const compare = document.getElementById('compare');
const message = document.getElementById('message');

let files1, files2;

drag1.addEventListener('dragover', function(e){
  e.preventDefault();
});

drag2.addEventListener('dragover', function(e){
  e.preventDefault();
});

drag1.addEventListener('drop', function(e){
  e.preventDefault();
  files1 = e.dataTransfer.files;
  filename1.classList.remove('top40');
  filename1.innerHTML = Array.from(files1).map(file => file.name).join('<br>');
  toggleCompareButton();
});

drag2.addEventListener('drop', function(e){
  e.preventDefault();
  files2 = e.dataTransfer.files;
  filename2.classList.remove('top40');
  filename2.innerHTML = Array.from(files2).map(file => file.name).join('<br>');
  toggleCompareButton();
});

drag1.addEventListener('click', function(e){
  fileinput1.click();
});

drag2.addEventListener('click', function(e){
  fileinput2.click();
});

fileinput1.addEventListener('change', function(e){
  files1 = e.target.files;
  filename1.classList.remove('top40');
  filename1.innerHTML = Array.from(files1).map(file => file.name).join('<br>');
  toggleCompareButton();
});

fileinput2.addEventListener('change', function(e){
  files2 = e.target.files;
  filename2.classList.remove('top40');
  filename2.innerHTML = Array.from(files2).map(file => file.name).join('<br>');
  toggleCompareButton();
});

const toggleCompareButton = function() {
  if (files1 && files2) {
    compare.style.opacity = 0.9;
  } else {
    compare.style.opacity = 0.4;
  }
};

compare.addEventListener('mousedown', function(e){
  if (!(files1 && files2)) return;
  compare.style.backgroundColor = '#008000';
});

for (let e of ['mouseleave', 'mouseup']) {
  compare.addEventListener(e, function(e){
    compare.style.backgroundColor = '';
  });
}

compare.addEventListener('click', function(e){
  if (hasError()) return;
  let readers1 = [];
  let readers2 = [];
  for (let i = 0; i < files1.length; i++) {

    const reader1 = new FileReader();
    readers1.push(reader1);
    reader1.onload = function(e){
      if ([...readers1, ...readers2].every(reader => reader.readyState == 2)) {
        compareContents(readers1, readers2);
      }
    };
    reader1.readAsText(files1[i]);

    const reader2 = new FileReader();
    readers2.push(reader2);
    reader2.onload = function(e){
      if ([...readers1, ...readers2].every(reader => reader.readyState == 2)) {
        compareContents(readers1, readers2);
      }
    };
    reader2.readAsText(files2[i]);
  }
});

const hasError = function() {
  if (
    (!files1 || !files2) ||
    (files1.length != files2.length) ||
    (!Array.from(files1).every(file => ['xlf', 'mqxliff', 'mxliff'].indexOf(file.name.split('.').pop()) >= 0)) ||
    (!Array.from(files2).every(file => ['xlf', 'mqxliff', 'mxliff'].indexOf(file.name.split('.').pop()) >= 0))
  ) {
    displayError('Error with files');
    return true;
  }
};

// TODO: give more specific error messages
const displayError = function(errorMessage) {
  message.textContent = errorMessage;
  setTimeout(function(){
    message.textContent = '';
  }, 5000);
};

const compareContents = function(readers1, readers2) {
  let contents1 = {};
  let contents2 = {};
  let results = {};
  for (let reader2 of readers2) {
    let [original, transId, source, target, percent, noteArrays] = parseXliff(reader2.result, 2);
    while (contents2.hasOwnProperty(original)) original = original + '_';
    contents2[original] = {target: target, note: noteArrays};
  }
  for (let reader1 of readers1) {
    let [original, transId, source, target, percent, noteArrays] = parseXliff(reader1.result, 1);
    while (contents1.hasOwnProperty(original)) original = original + '_';
    contents1[original] = {source: source, target: target, note: noteArrays};

    if (readers1.length == 1 && readers2.length == 1) {
      let onlyOriginal2 = Object.keys(contents2)[0];
      if (onlyOriginal2 != original) {
        contents2[original] = contents2[onlyOriginal2];
        delete contents2[onlyOriginal2];
      }
    }
    if (contents2.hasOwnProperty(original)) {
      results[original] = [];
      for (let i = 0; i < contents1[original].target.length; i++) {
        let shortSource = contents1[original].source[i]? tagToPlaceholder(contents1[original].source[i]): '';
        let stringArray1 = contents1[original].target[i]? tagAsOneChar(contents1[original].target[i]): [];
        let stringArray2 = (contents2[original].target.hasOwnProperty(i) && contents2[original].target[i])? tagAsOneChar(contents2[original].target[i]): [];
        let [dpTable, distance] = diffDP(stringArray1, stringArray2);
        let [diffString1, diffString2] = diffSES(dpTable, stringArray1, stringArray2);
        let combinedNote = combineNote(contents1[original].note[i], contents2[original].note[i]);
        results[original].push([transId[i], shortSource, diffString1, diffString2, percent[i], combinedNote, distance]);
      }
    }
  }
  if (!Object.keys(results).length) {
    displayError('No matching files');
  } else {
    displayResults(results);
  }
};

const parseXliff = function(content) {
  const original = /<file [^>]*?original="([^"]+?)"/.exec(content)[1];
  let parsedTransId = [];
  let parsedSource = [];
  let parsedTarget = [];
  let parsedPercent = [];
  let parsedNoteArrays = [];
  const trimmedContent = content.replace(/<mq:historical-unit[^]+?<\/mq:historical-unit>/g, '').replace(/<alt-trans[^]+?<\/alt-trans>/g, '');
  const regexTransUnit = new RegExp('<trans-unit id="([^"]+?)"([^>]*?)>([^]+?)</trans-unit>', 'g');
  const regexPercent = new RegExp('(mq:percent|xmatch)="(\\d+)"');
  const regexSource = new RegExp('<source[^>]*?>([^]*?)</source>');
  const regexTarget = new RegExp('<target[^>]*?>([^]*?)</target>');
  const regexComment = new RegExp('(<mq:comment[^>]*?deleted="false"[^>]*?>([^]*?)</mq:comment>|<note>([^]*?)</note>)', 'g');
  let match, noteMatch;
  while (match = regexTransUnit.exec(trimmedContent)) {
    let transId = match[1];
    let matchPercent = regexPercent.exec(match[2]);
    let sourceMatch = regexSource.exec(match[3]);
    let targetMatch = regexTarget.exec(match[3]);
    let notes = [];
    while (noteMatch = regexComment.exec(match[3])) {
      notes.push(noteMatch[2] || noteMatch[3] || '');
    }
    parsedTransId.push(transId);
    parsedSource.push(sourceMatch? sourceMatch[1]: '');
    parsedTarget.push(targetMatch? targetMatch[1]: '');
    parsedPercent.push(matchPercent? matchPercent[2]: 0);
    parsedNoteArrays.push(notes);
  }
  return [original, parsedTransId, parsedSource, parsedTarget, parsedPercent, parsedNoteArrays];
};

const convertXMLEntities = function(string) {
  return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

const tagAsOneChar = function(string) {
  let stringArray = [];
  let match;
  while (match = /(<ph[^>]*?>.*?<\/ph[^>]*?>|&lt;.*?&gt;)/g.exec(string)) {
    stringArray.push(...string.substring(0, match.index).split(''));
    stringArray.push(`<span class="tag" title="${match[0].startsWith('<ph')? convertXMLEntities(match[0]): match[0]}">⬣</span>`);
    string = string.substring(match.index + match[0].length);
  }
  stringArray.push(...string.split(''));
  return stringArray;
};

const tagToPlaceholder = function(string) {
  return string.replace(/(<ph[^>]*?>.*?<\/ph[^>]*?>|&lt;.*?&gt;)/g, $0 => `<span class="tag" title="${$0.startsWith('<ph')? convertXMLEntities($0): $0}">⬣</span>`);
};

const combineNote = function(noteArray1, noteArray2) {
  if (noteArray2 == undefined) return [...new Set(noteArray1.map(note => `(1) ${note}\n`))];
  let combinedNoteArray = [];
  for (let i = 0; i < noteArray1.length; i ++) {
    let index2 = noteArray2.indexOf(noteArray1[i]);
    if (index2 > -1) {
      delete noteArray2[index2];
      if (noteArray1[i]) combinedNoteArray.push(`(1&2) ${noteArray1[i]}\n`);
    } else {
      if (noteArray1[i]) combinedNoteArray.push(`(1) ${noteArray1[i]}\n`);
    }
  }
  for (let i = 0; i < noteArray2.length; i ++) {
    if (noteArray2[i]) combinedNoteArray.push(`(2) ${noteArray2[i]}\n`);
  }
  return [...new Set(combinedNoteArray)].join('\n');
};

const diffDP = function(stringArray1, stringArray2) {
  // reference:
  // https://qiita.com/3000manJPY/items/c28ed74d2d06971c34ef
  const length1 = stringArray1.length;
  const length2 = stringArray2.length;
  if (length1 == 0) stringArray1 = [''];
  if (length2 == 0) stringArray2 = [''];
  const dpTable = new Array(length1 + 1).fill(0).map(row => new Array(length2 + 1).fill(0));
  for (let i = 0; i <= length1; i++) dpTable[i][0] = i;
  for (let j = 0; j <= length2; j++) dpTable[0][j] = j;
  for (let i = 0; i < length1; i++) {
    for (let j = 0; j < length2; j++) {
      dpTable[i + 1][j + 1] = Math.min(
        dpTable[i][j + 1] + 1, // insertion
        dpTable[i + 1][j] + 1, // deletion
        dpTable[i][j] + 1 * (stringArray1[i] != stringArray2[j]) // replacement
      );
    }
  }
  return [dpTable, dpTable[length1][length2]];
};

const diffSES = function(dpTable, stringArray1, stringArray2) {
  // reference:
  // https://qiita.com/yumura_s/items/43ad19fce4739201705e
  // https://gist.github.com/gurimusan/7e554eb12f9f59880053
  let i = dpTable.length - 1;
  let j = dpTable[0].length - 1;
  let ses1 = [];
  let ses2 = [];
  let ins = 'ins';
  let del = 'del';
  let keep = 'keep';
  while (i > 0 || j > 0) {
    if (i == 0) {
      ses2.unshift([ins, stringArray2[j - 1]]);
      j--;
    } else if (j == 0) {
      ses1.unshift([del, stringArray1[i - 1]]);
      i--;
    } else if (stringArray1[i - 1] == stringArray2[j - 1]) {
      ses1.unshift([keep, stringArray1[i - 1]]);
      ses2.unshift([keep, stringArray1[i - 1]]);
      i--;
      j--;
    } else if (dpTable[i - 1][j - 1] <= Math.min(dpTable[i - 1][j], dpTable[i][j - 1])) {
      ses1.unshift([del, stringArray1[i - 1]]);
      ses2.unshift([ins, stringArray2[j - 1]]);
      i--;
      j--;
    } else if (dpTable[i][j - 1] <= dpTable[i - 1][j]) {
      ses2.unshift([ins, stringArray2[j - 1]]);
      j--;
    } else {
      ses1.unshift([del, stringArray1[i - 1]]);
      i--;
    }
  }
  let diffStrings = [];
  for (let ses of [ses1, ses2]) {
    let diffString = '';
    let previousMode = keep;
    for (let k = 0; k < ses.length; k++) {
      let mode = ses[k][0];
      if (mode != previousMode) {
        if (previousMode != keep) {
          diffString += `</${previousMode}>`;
        } else {
          diffString += `<${mode}>`;
        }
        previousMode = mode;
      }
      diffString += ses[k][1];
      if (k == ses.length - 1) {
        if (mode != keep) {
          diffString += `</${mode}>`;
        }
      }
    }
    diffStrings.push(diffString);
  }
  return diffStrings;
};

const displayResults = function(results) {
  let resultTables = {};
  for (let original of Object.keys(results)) {
    let resultTable = '';
    for (let i = 0; i < results[original].length; i ++) {
      let editDistance = results[original][i].pop();
      resultTable += `<tr class="${editDistance? 'different': 'same'}"><td>${results[original][i].join('</td><td>')}</td></tr>\n`;
    }
    resultTables[original] = resultTable;
  }
  var request = new XMLHttpRequest();
  request.open('GET', 'Trans_Diff_Template.html', true);
  request.responseType = 'blob';
  request.onload = function(e) {
      var reader = new FileReader();
      reader.onload =  function(e) {
        const templateMatch = /<!-- Template Start -->([^]+?)<!-- Template End -->/.exec(reader.result);
        let resultBlob = new Blob([
          reader.result.replace(
            '<title>{ph0}</title>',
            `<title>Trans_Diff_${Object.keys(results)[0]}</title>`
          ).replace(
            templateMatch[0],
            Object.keys(resultTables).map(original => templateMatch[1].replace('{ph1}', original).replace('{ph2}', resultTables[original])).join('\n')
          )
        ], {type: 'text/html'});
        let resultURL = window.URL.createObjectURL(resultBlob);
        // reference:
        // https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
        let a = document.createElement('a');
        a.href = resultURL;
        a.download = `Trans_Diff_${Object.keys(results)[0]}.html`;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(resultURL);
        }, 0);
      };
      reader.readAsText(request.response);
  };
  request.send();
};

})();