const knex = require('../../db/knex1');


// ************************************** Biomarker (gene_drug_tissue table) Queries ***************************************************
const geneDrugTissueQuery = () => knex.select()
    .from('gene_drug_tissue')
    .join('genes', 'gene_drug_tissue.gene_id', 'genes.gene_id')
    .join('drugs', 'gene_drug_tissue.drug_id', 'drugs.drug_id');


// ************************************** API Endpoints Functions ***************************************************
/**
 * 
 * @param {Object} request - request object
 * @param {Object} response - response object
 */
const getBiomarkers = async (request, response) => {
    // drug and gene query parameter
    const { drug } = request.query;
    const { gene } = request.query;

    try {
        // check if the drug includes a single element 
        if (drug.split(',').length > 1) {
            throw new Error('Please pass a single drug as the query parameter');
        };

        // check if the gene includes a single element
        if (gene.split(',').length > 1) {
            throw new Error('Please pass a single gene as the query parameter');
        };

        // get biomarker data
        const biomarkers = await geneDrugTissueQuery()
            .where('gene_name', gene)
            .andWhere('drug_name', drug);

        // send response
        response.status(200).json({
            status: 'success',
            data: biomarkers,
        });

    } catch (error) {
        response.status(500).json({
            status: 'error',
            data: 'An error occurred in getBiomarkers end point',
        });
    }

};

module.exports = {
    getBiomarkers,
};
