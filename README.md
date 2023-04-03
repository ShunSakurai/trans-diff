# trans-diff

Create a filterable, commentable diff table from XLIFF files

[https://shunsakurai.github.io/trans-diff/](https://shunsakurai.github.io/trans-diff/)

## Roadmap and update history

TODO:
- [x] Support single file
- [x] Support multiple files (detect file IDs)
- [x] Save comments
- [ ] Unzip .mqxlz files
- [x] Implement Transifex URL converter

Updates:
- ⏱ Transifex URL converter doesn't directly download the XLIFF file anymore

## How to use

Please watch the "How to use" video on YouTube for details:

[![Trans Diff - How to use](https://img.youtube.com/vi/-zuSH3Bl_x0/0.jpg)](https://www.youtube.com/watch?v=-zuSH3Bl_x0)

### How to generate the diff file

It's pretty straight forward.
1. Export XLIFF files at the start and the end of the review.
  - For Transifex, click "Download for translation as XLIFF" (or "Download for use" when the source file is an XLIFF file)
  - For memoQ, click "Export" > "Export Bilingual", and unselect "Save a compressed file (.mqxlz)"
1. Choose XLIFF files (File 1 and File 2) and click "Compare". The diff file will be downloaded automatically.

Supported file types:

- .xlf ([XLIFF version 1.2](http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html))
- .mqxliff (.mqxlz not supported at the moment)
- .mxliff

Diff specs:

- The diff is created based on [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance)
- The comparison is character-based for full-width characters (e.g. Japanese) and word-based for half-width characters (e.g. English)

Limitations:

- Basically, the number of segments/strings needs to be the same between File 1 and File 2.

### How to use the diff file

Header:
- Filter the diff table with changed/unchanged status.
- Expand or collapse tag contents.
- The diff file opens in the darker mode if your computer is in dark mode. You can manually toggle the darker mode on or off.
- Click "Save Static View" to save the current filtered view without JavaScript, for reduced file size and for better security. The static file is not commentable or filterable.
- Click "Resave File" to save the full file.
- Filter with text (contains text, NOT contains text, matches regex, NOT matches regex, and in number range). For details, please hover over the left-most column in each row. For example, you can display only the segments with any comments by putting a dot "." in the regular expression row above the Note column.
- Click "Clear Filter" to erase all text in the filter.

Table:
- Click "▼" or the file name to hide the table for the file.
- Left-click the table header to sort the table by the column.
- Right-click the table header to hide other columns. It's useful for copy-pasting the column into a text editor.
- Click in the Note column to add comments. Please remember to resave the file after commenting, by pressing Ctrl/Cmd+S keys or clicking "Resave File".

### Downloading XLIFF files

Trans Diff has a Transifex URL converter. The URL of the editor `https://app.transifex.com/{organization}/{project}/translate/#{lang}/{resource}/{stringId}?{query}` is converted to `https://app.transifex.com/{organization}/{project}/{resource}` and you can download the XLIFF file by selecting your language and pressing the "Download for translation as XLIFF" button. It's useful to download the XLIFF files before and after you do translation or review in Tranifex. *Please note that this is not an official feature of Transifex.*

Usage:

- Paste the Transifex editor URL in the converter (which looks like Terminal / Command Prompt), *move cursor at the end of the line*, and press Enter key to download the XLIFF file
- You can reference the previous input by pressing Arrow Up key

## Motivation and inspiration

Originally I wanted to compare .mqxlz files but the project has been dormant because it was tricky to implement the code to unzip files in client JavaScript. It seems .mqxlz is a ZIP64 format.
I recently often work with Transifex XLIFF files so I resumed this project.
I was highly inspired and motivated by the diff tool by [AlissaSabre](https://github.com/AlissaSabre), not on GitHub though.

## License

Anyone can use this tool free of charge.

[MIT License](https://github.com/ShunSakurai/trans-diff/blob/master/LICENSE)

## Privacy policy and terms of use

We don't store your data. We physically can't. (Borrowed part from [here](https://github.com/amitg87/asana-chrome-plugin/wiki/Privacy-policy).) All actions are done on client JavaScript on your computer.

I try my best to maintain the quality and safety of this extension, but please use it at your own risk. The author doesn't take any responsibility for any damage caused by use of this tool.

## Feedback and contribution

I'd love to hear from users and developers.
Please feel free to post feature requests, bug reports, and questions through the [GitHub Issues](https://github.com/ShunSakurai/trans-diff/issues). I'd also welcome pull requests.