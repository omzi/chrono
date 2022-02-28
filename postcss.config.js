const PostCSSPlugins = [
  require.resolve('postcss-simple-vars'),
  require.resolve('postcss-import'),
  require.resolve('postcss-nested'),
  require.resolve('autoprefixer')
];

module.exports = {
  plugins: PostCSSPlugins
};