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
});

drag2.addEventListener('drop', function(e){
  e.preventDefault();
  files2 = e.dataTransfer.files;
  filename2.textContent = files2[0].name;
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
});

fileinput2.addEventListener('change', function(e){
  files2 = e.target.files;
  filename2.textContent = files2[0].name;
});

compare.addEventListener('click', function(e){
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
    (!files1[0].name.endsWith('.xlf') || !files2[0].name.endsWith('.xlf'))
  ) {
    displayError();
    return true;
  }
};

const displayError = function() {
  message.textContent = 'Error';
  setTimeout(function(){
    message.textContent = '';
  }, 5000);
};

const compareContents = function(contents) {
  contents = contents.map(content => parseXliff(content));
  if (
    (contents[0].length != contents[1].length) ||
    (contents[0][0] != contents[1][0])
  ) {
    displayError();
    return;
  }
  let results = [];
  for (let i = 0; i < contents[0].length; i++) {
    let dpTable = diffDP(contents[0][i], contents[1][i]);
    let ses = diffSES(dpTable);
    let diffString1;
    let diffString2;
    results.push(i, diffString1, diffString2);
  }
  displayResults(results);
};

const parseXliff = function(content) {
  let parsedContent = [];
  parsedContent.push(/<file [^>]*?original="([^"]+?)"/.exec(content)[1]);
  let match;
  const regex = new RegExp(/<target[^>]*?>([^<]*?)<\/target>/g);
  while (match = regex.exec(content)) {
    parsedContent.push(match[1]);
  }
  return parsedContent;
};

const diffDP = function(string1, string2) {
};

const diffSES = function(dpTable) {

};

const displayResults = function(results) {
};
