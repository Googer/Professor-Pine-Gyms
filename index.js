const log = require('loglevel')
require('loglevel-prefix-persist/server')(process.env.NODE_ENV, log, {
	level: {
		production: 'debug',
		development: 'debug'
	},
	persist: 'debug',
	max: 5
});

log.setLevel('debug');

const settings = require('./settings'),
	knex = require('knex')({
		client: 'mysql',
		connection: {
			host: settings.db.host,
			user: settings.db.user,
			password: settings.db.password,
			database: settings.db.schema
		},
		migrations: {
			directory: './db'
		}
	}),
	insertIfAbsent = function (table_name, data, transaction = undefined) {
		const first_data = data[0] ?
			data[0] :
			data,
			object_properties = Object.getOwnPropertyNames(first_data),
			exists_query = knex(table_name)
				.where(object_properties[0], first_data[object_properties[0]]);

		for (let i = 1; i < object_properties.length; i++) {
			exists_query
				.andWhere(object_properties[i], first_data[object_properties[i]]);
		}

		return exists_query
			.first()
			.then(result => {
				if (!result) {
					return transaction ?
						knex(table_name).transacting(transaction)
							.insert(first_data)
							.returning('id') :
						knex(table_name)
							.insert(first_data)
							.returning('id');
				} else {
					return [result.id];
				}
			});
	};

// Create DB schema
knex.migrate.latest()
	.then(() => {
		// Seed DB
		const gyms = require('PgP-Data/data/gyms');

		gyms.forEach(gym => {
			insertIfAbsent('Gym', Object.assign({},
				{
					gymId: gym.gymId,
					name: gym.gymName,
					description: gym.gymInfo.gymDescription,
					latitude: gym.gymInfo.latitude,
					longitude: gym.gymInfo.longitude,
					nearestGym: gym.gymInfo.nearestGym
				}))
				.catch(err => log.error(err));
		});
	})
	.catch(err => {
		log.error(err);
		process.exit(1);
	});
