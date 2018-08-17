exports.up = function (knex, Promise) {
	return Promise.all([
		knex.schema.table('Gym', table => {
			table.string('nearestGym', 40);
		})
	])
};

exports.down = function (knex, Promise) {
	return Promise.all([
		knex.schema.table('Gym', table => {
			table.dropColumn('nearestGym');
		})
	])
};
