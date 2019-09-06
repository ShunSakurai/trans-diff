# trans-diff

Create a filterable diff table from xliff files

### Roadmap

- [x] Support single file
- [ ] Support multiple files (detect file IDs)
- [ ] Save comments
- [ ] Unzip .mqxlz files

### How to use

It's pretty straight forward. Choose XLIFF files and press "Compare". The diff file will be downloaded automatically.

Supported file types:

- .xlf ([XLIFF version 1.2](http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html) - intended for [XLIFF files downloaded from Transifex](https://docs.transifex.com/projects/downloading-translations#section-downloading-translations-for-a-specific-language)])
- .mqxliff (.mqxlz not supported at the moment)

### Downloading XLIFF files

Trans Diff has a Transifex URL converter. The URL of the editor `https://www.transifex.com/{organization}/{project}/translate/#{lang}/{resource}/{stringId}?{query}` is converted to `https://www.transifex.com/{organization}/{project}/{resource}/{lang}/download/xliff` and the translation is downloaded as an XLIFF file.
It's useful to download the XLIFF files before and after you do translation or review in Tranifex. *This is not an official feature of Transifex.*

### Motivation and inspiration

Originally I wanted to compare .mqxlz files but the project has been dormant because it was tricky to implement the code to unzip files in client JavaScript. It seems .mqxlz is a ZIP64 format.
I recently often work with Transifex xliff files so I resumed this project.
I was highly inspired and motivated by the diff tool by [AlissaSabre](https://github.com/AlissaSabre), not on GitHub though.

### Privacy policy and terms of use

We don't store your data. We physically can't. (Borrowed part from [here](https://github.com/amitg87/asana-chrome-plugin/wiki/Privacy-policy).) All actions are done on client JavaScript on your computer.

I try my best to maintain the quality and safety of this extension, but please use it at your own risk. The author doesn't take any responsibility for any damage caused by use of this tool.

### Feedback and contribution

I'd love to hear from users and developers.
Please feel free to post feature requests, bug reports, and questions through the [GitHub Issues](https://github.com/ShunSakurai/trans-diff/issues). I'd also welcome pull requests.

### License

[MIT License](https://github.com/ShunSakurai/trans-diff/blob/master/LICENSE)
