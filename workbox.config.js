module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{png,xml,ico,html,js,webmanifest,svg,mp3}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/,
		/^source/
	]
};