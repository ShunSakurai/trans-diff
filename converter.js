(function() {

const regexTransifex = new RegExp('(https://app.transifex.com/[^/]+/[^/]+)/translate/#([^/]+)/([^/]+?)($|[/?])');
const terminal = document.getElementById('terminal');
const terminalPaste = 'Paste the editor URL and press Enter:\n';
const terminalDownloading = 'Please download the XLIFF file manually from:\n';
const terminalManual = 'The URL seems to be "All resources" view. Please select the resource and manually download the XLIFF file from:\n';
const terminalError = 'Sorry, the URL doesn\'t look right.';
terminal.value += terminalPaste;
let previousInput;

terminal.addEventListener('click', function(e) {
  if (terminal.selectionStart != terminal.selectionEnd) return;
  const length = terminal.value.length;
  if (terminal.selectionEnd < length) terminal.setSelectionRange(length, length);
});

terminal.addEventListener('keyup', function(e) {
  e.stopPropagation();
  const currentValue = terminal.value;
  const textareaValues = currentValue.split('\n');
  if (e.key == 'Enter') {
    if (currentValue.match(/\n$/) == null) return;
    previousInput = textareaValues[textareaValues.length-2];
    const convertedURL = convertURLText(previousInput);
    if (convertedURL) {
      terminal.value += convertedURL + '\n\n' + terminalPaste;
      window.open(convertedURL);
    } else {
      terminal.value += terminalError + '\n\n' + terminalPaste;
    }
    terminal.scrollTop = terminal.scrollHeight;
  } else if (e.key == 'ArrowUp') {
    e.preventDefault();
    terminal.value = textareaValues.slice(0, textareaValues.length - 1).join('\n') + '\n' + previousInput;
    terminal.scrollTop = terminal.scrollHeight;
    const length = terminal.value.length;
    if (terminal.selectionEnd < length) terminal.setSelectionRange(length, length);
  }
});

const convertURLText = function(text) {
  const match = regexTransifex.exec(text);
  if (!match) return '';
  if (match[3] == '$') {
    terminal.value += terminalManual;
    return `${match[1]}/language/${match[2]}`;
  } else if (match[3].endsWith('xliff')) {
    terminal.value += terminalDownloading;
    return `${match[1]}/${match[3]}/${match[2]}/download/for_translation`;
  } else {
    terminal.value += terminalDownloading;
    return `${match[1]}/${match[3]}/${match[2]}/download/xliff`;
  }
};

})();