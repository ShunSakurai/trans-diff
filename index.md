<div class="content">

  <div class="file file1">
    <h1>File 1</h1>
    <div class="drag" id="drag1" title="Supported files:&#13;&#10;- .xlf&#13;&#10;- .mqxliff&#13;&#10;- .mxliff">
      <p class="center top25" id="filename1">File(s) exported before review - drag here or click to browse</p>
      <input id="fileinput1" name="fileinput1" style="display: none;" type="file" multiple>
    </div>
  </div>

  <div class="file file2">
    <h1>File 2</h1>
    <div class="drag" id="drag2" title="Supported files:&#13;&#10;- .xlf&#13;&#10;- .mqxliff&#13;&#10;- .mxliff">
      <p class="center top25" id="filename2">Updated file(s) - drag here or click to browse</p>
      <input id="fileinput2" name="fileinput2" style="display: none;" type="file" multiple>
    </div>
  </div>

  <div class="button" id="compare">
    <p class="center top25">Compare</p>
  </div>
  <div class="message" id="message"></div>

  <div class="converter subsection">
    <h3 style="float: left;">Transifex URL converter - download XLIFF file</h3>
    <textarea class="terminal" id="terminal" spellcheck="false"></textarea>
    <small class="note">* The behavior of Transifex changed, and we no longer can download the XLIFF file directly using this converter. Instead, the converter opens the resource page so please manually download the XLIFF file from that page.</small>
  </div>

</div>

<div>
  <h3>Documentation</h3>
    Please see <a href="https://github.com/ShunSakurai/trans-diff#how-to-use" rel="noopener oreferrer" tabindex="-1" target="blank_">README</a> and the video:
    <iframe width="448" height="332" src="https://www.youtube.com/embed/-zuSH3Bl_x0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<div>
You might be interested in other tools by the developer:
- <a href="https://shunsakurai.github.io/kinsoku-checker/" rel="noopener oreferrer" tabindex="-1" target="blank_">Kinsoku Checker</a>
</div>

<script src="script.js" type="text/javascript" charset="utf-8" async defer></script>
<script src="converter.js" type="text/javascript" charset="utf-8" async defer></script>