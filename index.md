<div class="content">

  <div class="file file1">
    <h1>File 1</h1>
    <div class="drag" id="drag1" title="Supported files:&#13;- .xlf&#13;- .mqxliff&#13;- .mxliff">
      <p class="center top40" id="filename1">Drag file(s) here or click to browse</p>
      <input id="fileinput1" name="fileinput1" style="display: none;" type="file" multiple>
    </div>
  </div>

  <div class="file file2">
    <h1>File 2</h1>
    <div class="drag" id="drag2" title="Supported files:&#13;- .xlf&#13;- .mqxliff&#13;- .mxliff">
      <p class="center top40" id="filename2">Drag file(s) here or click to browse</p>
      <input id="fileinput2" name="fileinput2" style="display: none;" type="file" multiple>
    </div>
  </div>

  <div class="button" id="compare">
    <p class="center top25">Compare</p>
  </div>
  <div class="message" id="message"></div>

  <!-- Reference:
  https://dianxnao.com/htmljs%EF%BC%9Atextarea%E3%82%BF%E3%82%B0%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%82%92%E3%82%BF%E3%83%BC%E3%83%9F%E3%83%8A%E3%83%AB%E9%A2%A8%E3%81%AB%E8%A3%85/#toc5 -->
  <div class="converter">
    <h3 style="float: left;">Transifex URL converter</h3>
    <textarea class="terminal" id="terminal" spellcheck="false"></textarea>
  </div>

</div>

<script src="script.js" type="text/javascript" charset="utf-8" async defer></script>
<script src="converter.js" type="text/javascript" charset="utf-8" async defer></script>