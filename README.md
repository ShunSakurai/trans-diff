# trans-diff
Create a filterable diff table from xliff files

### Roadmap
- [x] Support single file
- [ ] Support multiple files (detect file IDs)
- [ ] Save comments
- [ ] Unzip .mqxlz files

### Supported files
- .xlf ([XLIFF version 1.2](http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html) - intended for [XLIFF files downloaded from Transifex](https://docs.transifex.com/projects/downloading-translations#section-downloading-translations-for-a-specific-language)])
- .mqxliff (.mqxlz not supported at the moment)

### Motivation and inspiration

Originally I wanted to compare .mqxlz files but the project has been dormant because it was tricky to implement the code to unzip files. It seems .mqxlz is ZIP64 format.
I recently often work with Transifex xliff files so I resumed this project.
I was highly inspired and motivated by the diff tool by [AlissaSabre](https://github.com/AlissaSabre), not on GitHub though.

### Privacy policy and terms of use

We don't store your data. We physically can't. (Borrowed part from [here](https://github.com/amitg87/asana-chrome-plugin/wiki/Privacy-policy).) All actions are done on client JavaScript on your computer.

I try my best to maintain the quality and safety of this extension, but please use it at your own risk. The author doesn't take any responsibility for any damage caused by use of this tool.

### Feedback and contribution

I'd love to hear from users and developers.
Please feel free to post feature requests, bug reports, and questions through the [GitHub Issues](https://github.com/ShunSakurai/trans-diff/issues). I'd also welcome pull requests and help with translating the UI.

### License

[MIT License](https://github.com/ShunSakurai/trans-diff/blob/master/LICENSE)
