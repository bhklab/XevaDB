/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const dataPath = require('../path');

const csvFilePath = path.join(dataPath, 'gene_drug_tissue.csv');

exports.seed = async (knex) => {
	const abs = path.resolve(csvFilePath).replace(/\\/g, '/');
	if (!fs.existsSync(abs)) throw new Error(`CSV not found at: ${abs}`);

	console.log('====================truncating gene_drug_tissue====================');
	await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
	await knex.raw('SET UNIQUE_CHECKS = 0');
	await knex('gene_drug_tissue').truncate();

	const sql = `
		LOAD DATA LOCAL INFILE ?
		INTO TABLE gene_drug_tissue
		CHARACTER SET utf8mb4
		FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
		ESCAPED BY '\\\\'
		LINES TERMINATED BY '\\n'
		IGNORE 1 LINES
    (
		@id,
		@gene_id,
		@dataset_id,
		@drug_id,
		@tissue_id,
		@estimate,
		@ci_lower,
		@ci_upper,
		@pvalue,
		@fdr,
		@n,
		@mDataType,
		@metric
	)
	SET
		id         = NULLIF(@id,''),
		gene_id    = NULLIF(@gene_id,''),
		dataset_id = NULLIF(@dataset_id,''),
		drug_id    = NULLIF(@drug_id,''),
		tissue_id  = NULLIF(@tissue_id,''),
		estimate   = NULLIF(@estimate,''),
		ci_lower   = NULLIF(@ci_lower,''),
		ci_upper   = NULLIF(@ci_upper,''),
		pvalue     = NULLIF(@pvalue,''),
		fdr        = NULLIF(@fdr,''),
		n          = NULLIF(@n,''),
		mDataType  = NULLIF(@mDataType,''),
		metric     = NULLIF(@metric,'');
  	`;

	try {
		const res = await knex.raw(sql, [abs]);
		const info = Array.isArray(res) ? res[0]?.info || res[0] : res;
		console.log('LOAD DATA result:', info);
	} catch (err) {
		console.error('LOAD DATA failed:', err.sqlMessage || err);
		throw err;
	} finally {
		await knex.raw('SET UNIQUE_CHECKS = 1');
		await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
	}

	console.log('====================finished seeding gene_drug_tissue====================');
};
