function taskStatusColor(entry) {
	if(!entry) return '';
	var start = new Date(entry.values.start);
	var deadline = new Date(entry.values.due);

	switch(entry.values.state){
		case 'Pending':
		case 'Paused':
			if(new Date() < start) return '';
			else if(new Date() >= start && new Date() < deadline) return 'bg-warning';
			else return 'bg-danger';
		case 'Working':
			if(new Date() < start) return '';
			else if(new Date() >= start && new Date() < deadline) return 'bg-info';
			else return 'bg-danger';
		case 'Done': return 'text-muted';
		default: return '';
	}
}
function stateColor(entry) {
	if(!entry) return '';
	var start = new Date(entry.values.start);
	var deadline = new Date(entry.values.due);

	switch(entry.values.state){
		case 'Pending':
			if(new Date() < start) return '';
			else if(new Date() >= start && new Date() < deadline) return 'bg-warning';
			else return 'bg-danger';
		case 'Paused':
			if(new Date() < start) return '';
			else return 'bg-warning';
		case 'Working':
			return 'bg-primary';
		case 'Done': return 'text-muted';
		default: return '';
	}
}

function taskStatusColorHiddenXs(entry){
	return taskStatusColor(entry) + ' hidden-xs';
}



module.exports = function (nga, admin) {

		var projects = admin.getEntity('projects');
		var users = nga.entity('users');

		projects.identifier(nga.field('_id'));
		users.identifier(nga.field('_id'));

		projects.listView()
		.title('Projectes')
		.fields([
				nga.field('name')
					.label('Nom')
					.isDetailLink(true)
					.detailLinkRoute('show'),

				nga.field('members', 'reference_many')
					.label('Membres')
					.targetEntity(users)
					.targetField(nga.field('name'))
					.isDetailLink(true)
					.remoteComplete(true, {
						refreshDelay: 500
					})
		])
		.sortField('name')
		.sortDir('ASC')
		.exportOptions({
			quotes: true,
			delimiter: ';'
		})
		.exportFields([])
		.batchActions([])
		.listActions(['show']);

		// EDIT

		projects.showView()
				.title('Projecte')
				.actions([
					'<ma-filtered-list-button entity-name="tasks" label="Tasques del projecte" filter="{ project: entry.values._id }"></ma-filtered-list-button>',
					'edit',
					'list',
					'delete'
				])
				.fields([
					nga.field('name')
						.label('Nom'),

					nga.field('description', 'wysiwyg')
						.label('Notes'),

					nga.field('', 'template')
						.label('')
						.template('<ma-create-button entity-name="tasks" size="sm" label="Afegeix una tasca" default-values="{ project: entry.values._id }"></ma-create-button>'),

					nga.field('tasks', 'embedded_list')
						.label('Tasques')
						.targetFields([
							nga.field('name')
								.label('Nom')
								.template('<a href="#/tasks/show/{{entry.values._id}}">{{value}}</a>'),
							// nga.field('start', 'date')
							// 	.label('Inici')
							// 	.template('<a href="#/tasks/show/{{entry.values._id}}">{{value | date:\'dd MMM\'}}</a>')
							// 	.cssClasses(taskStatusColorHiddenXs),
							nga.field('due', 'date')
								.label('Deadline')
								.template('<a href="#/tasks/show/{{entry.values._id}}">{{value | date:\'dd MMM\'}}</a>')
								.cssClasses(taskStatusColorHiddenXs),
							nga.field('state', 'choice')
								.label('Estat')
								.choices([
									{ value: 'Pending', label: 'Pendent' },
									{ value: 'Working', label: 'Treballant' },
									{ value: 'Paused', label: 'En pausa' },
									{ value: 'Done', label: 'Acabada' }
								])
								.cssClasses(stateColor)
						])
						.sortField('due')
						.sortDir('ASC'),

					nga.field('members', 'reference_many')
						.label('Membres')
						.targetEntity(users)
						.targetField(nga.field('name'))
						.remoteComplete(true, {
							refreshDelay: 500
						})
						.perPage(20),

						nga.field('gantt')
							.template('<project-gantt tasks="entry.values.tasks" project="entry.values._id"></project-gantt>', true),
						nga.field('hours')
							.template('<project-hours tasks="entry.values.tasks" project="entry.values._id"></project-hours>', true)
				]);



		projects.editionView()
			.title('Projecte')
			.fields([
				nga.field('name')
					.label('Nom')
					.validation({required: true}),

				nga.field('description', 'wysiwyg')
					.label('Notes'),

				nga.field('members', 'reference_many')
					.label('Membres')
					.targetEntity(users)
					.targetField(nga.field('name'))
					.remoteComplete(true, {
						refreshDelay: 500
						// searchQuery: function(search) { return { q: search }; }
					})
					.perPage(20)
			]);



		projects.creationView()
				.title('Projecte nou')
				.fields([
					nga.field('name')
						.label('Nom')
						.validation({required: true}),

					nga.field('description', 'wysiwyg')
						.label('Notes'),

					nga.field('members', 'reference_many')
						.label('Membres')
						.targetEntity(users)
						.targetField(nga.field('name'))
						.remoteComplete(true, {
							refreshDelay: 500
							// searchQuery: function(search) { return { q: search }; }
						})
						.perPage(20)
				]);

		return projects;
};
