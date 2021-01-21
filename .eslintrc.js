module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended'],
  plugins: [],
  // add your custom rules here
  rules: {
    'prefer-const': 0,
    'comma-style': 0,
    'brace-style': 0,
    curly: 0,
    'generator-star-spacing': 'off',
    indent: 0,
    'arrow-parens': 0,
    'spaced-comment': 0,
    'no-trailing-spaces': 0,
    'no-multiple-empty-lines': 0,
    'no-unused-vars': 0,
    'no-use-before-define': 0,
    'no-useless-escape': 0,
    'no-useless-constructor': 0,
    'no-undef': 0,
    'object-property-newline': 0,
    'space-before-function-paren': 0,
    'vue/require-prop-types': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/no-v-html': 'off',
    'vue/html-indent': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/no-parsing-error': ['error', { 'x-invalid-end-tag': false }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'standard/computed-property-even-spacing': 'off',
    'vue/order-in-components': 0,
    'vue/no-unused-components': 0,
    'vue/html-closing-bracket-newline': 0,
    'unicode-bom': 0
  }
}
