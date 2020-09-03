module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "arrow-parens": 0,
    "generator-star-spacing": 0,
    "eol-last": 0,
    "space-before-function-paren": 0,
    "comma-dangle": 0,
    "no-return-assign": 0,
    camelcase: 0,
    "no-useless-computed-key": 0,
    quotes: [1, "single"], //引号类型 `` "" ''
    'quote-props': 0, // 对象字面量中的属性名是否强制双引号
    semi: 0, // semi: [1, "never"],
    "no-unused-vars": 0,
    "prefer-promise-reject-errors": 0
  }
}
