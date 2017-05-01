module.exports = function (nga, admin) {

	var albums = admin.getEntity('albums');

	albums.identifier(nga.field('_id'));

	// LIST

	albums.listView()
		.title('Albums')
		.fields([
			nga.field('name')
				.label('Name')
				.isDetailLink(true)
				.detailLinkRoute('show'),
			nga.field('created', 'date')
				.label('Created')
				.format('dd/MM/yyyy HH:mm')
				.isDetailLink(true)
				.detailLinkRoute('show')
		])
		.sortField('created')
		.sortDir('DESC')
		.exportOptions({
			quotes: true,
			delimiter: ';'
		})
		.exportFields([])
		.batchActions([])
		.listActions(['show'])
		.filters([
		]);


	// SHOW

	albums.showView()
		.title('Album')
		.fields([
			nga.field('name')
				.label('Name')
				.isDetailLink(true)
				.detailLinkRoute('show'),
			nga.field('created', 'date')
				.label('Created')
				.format('dd/MM/yyyy HH:mm')
				.isDetailLink(true)
				.detailLinkRoute('show')
		]);


	// EDIT

	albums.editionView()
		.title('Album')
		.fields([
			nga.field('name')
				.label('Name')
				.isDetailLink(true)
				.detailLinkRoute('show'),
			nga.field('created', 'date')
				.label('Created')
				.format('dd/MM/yyyy HH:mm')
				.isDetailLink(true)
				.detailLinkRoute('show')
		]);


	// ADD

	albums.creationView()
		.title('Album')
		.fields([
			nga.field('name')
				.label('Name')
				.isDetailLink(true)
				.detailLinkRoute('show'),
			nga.field('created', 'date')
				.label('Created')
				.format('dd/MM/yyyy HH:mm')
				.isDetailLink(true)
				.detailLinkRoute('show')
		]);

	return albums;
};
