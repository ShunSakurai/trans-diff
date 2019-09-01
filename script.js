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
  readFiles();
  compareContents();
  displayResults();
});

const hasError = function() {
  if (
    (!files1 || !files2) ||
    (files1.length >= 2 || files2.length >= 2) ||
    (files1.length != files2.length) ||
    (!files1[0].name.endsWith('.xlf') || !files2[0].name.endsWith('.xlf'))
  ) {
    message.textContent = 'Error';
    setTimeout(function(){
      message.textContent = '';
    }, 5000);
    return true;
  }
};

const readFiles = function() {
  console.log('readFiles');
};

const compareContents = function() {
  console.log('compareContents');
};

const displayResults = function() {
  console.log('displayResults');
};
