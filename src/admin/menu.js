module.exports = function (nga, admin) {
	return nga.menu()

		.addChild(nga.menu()
			.icon('<span class="fa fa-home fa-fw"></span>')
			.title('Summary')
			.link('/summary')
		)
		.addChild(nga.menu(admin.getEntity('albums'))
			.icon('<span class="fa fa-list fa-fw"></span>')
			.title('Albums')
		)
};
