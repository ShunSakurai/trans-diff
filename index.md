<div class="content">

  <div class="file file1">
    <h1>File 1</h1>
    <div class="drag" id="drag1" title="Supported files:&#13;&#10;- .xlf&#13;&#10;- .mqxliff&#13;&#10;- .mxliff">
      <p class="center top40" id="filename1">Drag file(s) here or click to browse</p>
      <input id="fileinput1" name="fileinput1" style="display: none;" type="file" multiple>
    </div>
  </div>

  <div class="file file2">
    <h1>File 2</h1>
    <div class="drag" id="drag2" title="Supported files:&#13;&#10;- .xlf&#13;&#10;- .mqxliff&#13;&#10;- .mxliff">
      <p class="center top40" id="filename2">Drag file(s) here or click to browse</p>
      <input id="fileinput2" name="fileinput2" style="display: none;" type="file" multiple>
    </div>
  </div>

  <div class="button" id="compare">
    <p class="center top25">Compare</p>
  </div>
  <div class="message" id="message"></div>

  <div class="converter">
    <h3 style="float: left;">Transifex URL converter - download XLIFF file</h3>
    <textarea class="terminal" id="terminal" spellcheck="false"></textarea>
  </div>

</div>

<script src="script.js" type="text/javascript" charset="utf-8" async defer></script>
<script src="converter.js" type="text/javascript" charset="utf-8" async defer></script>