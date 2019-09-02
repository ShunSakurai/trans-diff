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
  filename1.textContent = files1[0].name;
  toggleCompareButton();
});

drag2.addEventListener('drop', function(e){
  e.preventDefault();
  files2 = e.dataTransfer.files;
  filename2.textContent = files2[0].name;
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
  filename1.textContent = files1[0].name;
  toggleCompareButton();
});

fileinput2.addEventListener('change', function(e){
  files2 = e.target.files;
  filename2.textContent = files2[0].name;
  toggleCompareButton();
});

const toggleCompareButton = function() {
  if (files1 && files2) {
    compare.style.opacity = 0.7;
  } else {
    compare.style.opacity = 0.3;
  }
};

compare.addEventListener('click', function(e){
  if (!(files1 && files2)) return;
  if (hasError()) return;
  const reader1 = new FileReader();
  const reader2 = new FileReader();
  reader1.onload = function(e){
    if (reader2.readyState == 2) {
      compareContents([reader1.result, reader2.result]);
    }
  };
  reader2.onload = function(e){
    if (reader1.readyState == 2) {
      compareContents([reader1.result, reader2.result]);
    }
  };
  reader1.readAsText(files1[0]);
  reader2.readAsText(files2[0]);
});

const hasError = function() {
  if (
    (!files1 || !files2) ||
    (files1.length >= 2 || files2.length >= 2) ||
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

const compareContents = function(contents) {
  const source = parseXliff(contents[0], 'source');
  contents = contents.map(content => parseXliff(content, 'target'));
  if (
    (contents[0].length != contents[1].length) ||
    (contents[0][0] != contents[1][0])
  ) {
    displayError();
    return;
  }
  let results = [];
  for (let i = 0; i < contents[0].length; i++) {
    let [dpTable, distance] = diffDP(contents[0][i], contents[1][i]);
    let [diffString1, diffString2] = diffSES(dpTable, contents[0][i], contents[1][i]);
    results.push([i, source[i], diffString1, diffString2, distance]);
  }
  displayResults(results);
};

const parseXliff = function(content, language) {
  let parsedContent = [];
  parsedContent.push(/<file [^>]*?original="([^"]+?)"/.exec(content)[1]);
  let match;
  const regex = new RegExp(`<${language}[^>]*?>([^<]*?)</${language}>`, 'g');
  content = content.replace(/<mq:historical-unit.+?<\/mq:historical-unit>/gs, '');
  while (match = regex.exec(content)) {
    parsedContent.push(match[1]);
  }
  return parsedContent;
};

const diffDP = function(string1, string2) {
  // reference:
  // https://qiita.com/3000manJPY/items/c28ed74d2d06971c34ef
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
  let resultTable = '';
  for (let i = 0; i < results.length; i ++) {
    let editDistance = results[i].pop();
    resultTable += `<tr class="${editDistance? 'different': 'same'}"><td>${results[i].join('</td><td>')}</td></tr>\n`;
  }
  var request = new XMLHttpRequest();
  request.open('GET', 'Trans_Diff_Template.html', true);
  request.responseType = 'blob';
  request.onload = function(e) {
      var reader = new FileReader();
      reader.onload =  function(e) {
        let resultBlob = new Blob([reader.result.replace('{placeholder}', resultTable)], {type: 'text/html'});
        let resultURL = window.URL.createObjectURL(resultBlob);
        // reference:
        // https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
        let a = document.createElement('a');
        a.href = resultURL;
        a.download = `Trans_Diff_${results[0][1]}.html`;
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
