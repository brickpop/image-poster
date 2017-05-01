// var removeDiacritics = require('../../lib/util.js').removeDiacritics;

module.exports = function (nga, admin) {

		var usuaris = admin.getEntity('usuaris');

		usuaris.identifier(nga.field('_id'));

		// usuaris.listView()
		// .title('Usuaris')
		// .fields([
		// 		nga.field('name')
		// 			.map(function(v){ return v || '(No name)'})
		// 			.isDetailLink(true)
		// ])
		// .sortField('lastName')
		// .sortDir('ASC')
		// .listActions(['edit'])
		// .batchActions([
		// 	'<usuaris-mark-retail selection="selection"></usuaris-mark-retail>',
		// 	'<usuaris-mark-wholesale selection="selection"></usuaris-mark-wholesale>',
		// 	'delete'
		// ])
		// .exportOptions({
		// 	quotes: true,
		// 	delimiter: ';'
		// })
		// .exportFields([
		// 	nga.field('name').map(removeDiacritics),
		// 	nga.field('lastName').label('Last Name').map(removeDiacritics)
		// ]);

		// usuaris.editionView()
		// .title('Customer')
		// .actions([
		// 	'<customer-mark-retail customer="entry"></customer-mark-retail>',
		// 	'<customer-mark-wholesale customer="entry"></customer-mark-wholesale>',
		// 	'list'
		// ])
		// .fields([
		// 		nga.field('name'),
		// 		nga.field('lastName').label('Last Name')
		// ]);

		// usuaris.creationView()
		// .title('Customer')
		// .fields([
		// 		nga.field('name'),
		// 		nga.field('lastName').label('Last Name')
		// ]);

		return usuaris;
};
