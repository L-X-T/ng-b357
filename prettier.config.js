module.exports = {
  bracketSameLine: true, // default: false; true for fewer lines in .html
  printWidth: 120, // default: 80; adjust to your team's preference
  singleQuote: true, // default: false; true for JS community style
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular',
      },
    },
  ],
};
