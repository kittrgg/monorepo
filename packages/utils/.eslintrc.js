module.exports = {
  extends: [require.resolve('@kittr/lint/node')],
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
  },
  root: true,
};
