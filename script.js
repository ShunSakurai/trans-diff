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
// Support only one file at the moment

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
    (!files1[0].name.endsWith('.xlf') && !files1[0].name.endsWith('.mqxliff')) ||
    (!files2[0].name.endsWith('.xlf') && !files2[0].name.endsWith('.mqxliff'))
  ) {
    displayError();
    return true;
  }
};

const displayError = function() {
  message.textContent = 'Error with files';
  setTimeout(function(){
    message.textContent = '';
  }, 5000);
};

const compareContents = function(readers1, readers2) {
  let contents1 = {};
  let contents2 = {};
  let results = {};
  for (let reader2 of readers2) {
    const [original, target] = parseXliff(reader2.result, 'target');
    contents2[original] = {'target': target};
  }
  for (let reader1 of readers1) {
    const [original, source] = parseXliff(reader1.result, 'source');
    contents1[original] = {'source': source, 'target': parseXliff(reader1.result, 'target')[1]};

    if (
      contents2.hasOwnProperty(original) &&
      contents1[original].target.length == contents2[original].target.length
    ) {
      results[original] = [];
      for (let i = 1; i < contents1[original].target.length; i++) {
        let [dpTable, distance] = diffDP(contents1[original].target[i], contents2[original].target[i]);
        let [diffString1, diffString2] = diffSES(dpTable, contents1[original].target[i], contents2[original].target[i]);
        results[original].push([i, source[i], diffString1, diffString2, distance]);
      }
    }
  }
  displayResults(results);
};

const parseXliff = function(content, language) {
  const original = /<file [^>]*?original="([^"]+?)"/.exec(content)[1];
  let parsedContent = [];
  const trimmedContent = content.replace(/<mq:historical-unit.+?<\/mq:historical-unit>/gs, '');
  const regexTransUnit = new RegExp('<trans-unit id="(\\d+)(?:\\[\\d\\])?"[^>]*?>(.+?)</trans-unit>', 'gs');
  const regex = new RegExp(`<${language}[^>]*?>(.*?)</${language}>`, 's');
  let match;
  let transId = 0;
  while (match = regexTransUnit.exec(trimmedContent)) {
    transId = match[1];
    let segmentMatch = regex.exec(match[2]);
    parsedContent[transId] = segmentMatch? segmentMatch[1]: '';
  }
  return [original, parsedContent];
};

const diffDP = function(string1, string2) {
  // reference:
  // https://qiita.com/3000manJPY/items/c28ed74d2d06971c34ef
  if (string1 == null) string1 = '';
  if (string2 == null) string2 = '';
  const length1 = string1.length;
  const length2 = string2.length;
  const dpTable = new Array(length1 + 1).fill(0).map(row => new Array(length2 + 1).fill(0));
  for (let i = 0; i <= length1; i++) dpTable[i][0] = i;
  for (let j = 0; j <= length2; j++) dpTable[0][j] = j;
  for (let i = 0; i < length1; i++) {
    for (let j = 0; j < length2; j++) {
      dpTable[i + 1][j + 1] = Math.min(
        dpTable[i][j + 1] + 1, // insertion
        dpTable[i + 1][j] + 1, // deletion
        dpTable[i][j] + 1 * (string1[i] != string2[j]) // replacement
      );
    }
  }
  return [dpTable, dpTable[length1][length2]];
};

const diffSES = function(dpTable, string1, string2) {
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
      ses2.unshift([ins, string2[j - 1]]);
      j--;
    } else if (j == 0) {
      ses1.unshift([del, string1[i - 1]]);
      i--;
    } else if (string1[i - 1] == string2[j - 1]) {
      ses1.unshift([keep, string1[i - 1]]);
      ses2.unshift([keep, string1[i - 1]]);
      i--;
      j--;
    } else if (dpTable[i - 1][j - 1] <= Math.min(dpTable[i - 1][j], dpTable[i][j - 1])) {
      ses1.unshift([del, string1[i - 1]]);
      ses2.unshift([ins, string2[j - 1]]);
      i--;
      j--;
    } else if (dpTable[i][j - 1] <= dpTable[i - 1][j]) {
      ses2.unshift([ins, string2[j - 1]]);
      j--;
    } else {
      ses1.unshift([del, string1[i - 1]]);
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
        const templateMatch = /<!-- Template Start -->(.+?)<!-- Template End -->/s.exec(reader.result);
        let resultBlob = new Blob([
          reader.result.replace(
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