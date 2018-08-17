exports.up = function (knex, Promise) {
	return Promise.all([
		knex.schema.table('Gym', table => {
			table.decimal('latitude', 9, 6).alter();
			table.decimal('longitude', 9, 6).alter();
		})
	])
};

exports.down = function (knex, Promise) {
	return Promise.all([
		knex.schema.table('Gym', table => {
			table.decimal('latitude', 8, 6).alter();
			table.decimal('longitude', 8, 6).alter();
		})
	])
};
