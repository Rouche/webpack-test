module.exports = (ctx) => {
	return {
		plugins: {
			'autoprefixer': {
				browsers: ['last 2 versions']
			},
			'cssnano': ctx.webpack.options.mode == 'production'
		}
	}
}