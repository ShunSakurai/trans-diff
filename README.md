# trans-diff

Create a filterable, commentable diff table from XLIFF files

[https://shunsakurai.github.io/trans-diff/](https://shunsakurai.github.io/trans-diff/)

## Roadmap

- [x] Support single file
- [x] Support multiple files (detect file IDs)
- [x] Save comments
- [ ] Unzip .mqxlz files

## How to use

Please watch the "How to use" video on YouTube for details:

[![Trans Diff - How to use](https://img.youtube.com/vi/-zuSH3Bl_x0/0.jpg)](https://www.youtube.com/watch?v=-zuSH3Bl_x0)

### How to generate the diff file

It's pretty straight forward.
- Export XLIFF files at the start and the end of the review.
- Choose XLIFF files (File 1 and File 2) and click "Compare". The diff file will be downloaded automatically.

Supported file types:

- .xlf ([XLIFF version 1.2](http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html) - intended for [XLIFF files downloaded from Transifex](https://docs.transifex.com/projects/downloading-translations#section-downloading-translations-for-a-specific-language))
- .mqxliff (.mqxlz not supported at the moment)
- .mxliff

Limitations:

- Basically, the number of segments/strings needs to be the same between File 1 and File 2.

### How to use the diff file

- You can filter the diff table with changed/unchanged status or with text (regular expression is supported) or number range. For details, please hover over the left-most column in each row. For example, you can display only the segments with any comments by putting a dot "." in the regular expression row above the Note column.
- You can sort the table by columns by clicking the table header.
- Click in the Note column to add comments. Please remember to resave the file after commenting, by pressing Ctrl/Cmd+S keys or clicking the "Resave File" button.
- Click the "Save Static View" to save the current filtered view without JavaScript, for reduced file size and for better security. The static file is not commentable or filterable.

### Downloading XLIFF files

Trans Diff has a Transifex URL converter. The URL of the editor `https://www.transifex.com/{organization}/{project}/translate/#{lang}/{resource}/{stringId}?{query}` is converted to `https://www.transifex.com/{organization}/{project}/{resource}/{lang}/download/xliff` and the translation is downloaded as an XLIFF file. This corresponds with the "Download for translation as XLIFF" button in Transifex.
It's useful to download the XLIFF files before and after you do translation or review in Tranifex. *Please note that this is not an official feature of Transifex.*

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