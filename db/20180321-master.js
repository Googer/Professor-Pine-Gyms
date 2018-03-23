exports.up = function (knex, Promise) {
	return Promise.all([
		knex.schema.createTable('Gym', table => {
			table.increments('id')
				.primary();

			table.string('gymId', 40)
				.unique();

			table.string('name', 1000);
			table.string('description', 5000);

			table.decimal('latitude', 8, 6);
			table.decimal('longitude', 8, 6);
		})
	])
};

exports.down = function (knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('Gym')
	])
};
