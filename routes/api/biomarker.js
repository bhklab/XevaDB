const knex = require('../../db/knex1');


// ************************************** Biomarker (gene_drug_tissue table) Queries ***************************************************
const geneDrugTissueQuery = () => knex.select()
    .from('gene_drug_tissue')
    .join('genes', 'gene_drug_tissue.gene_id', 'genes.gene_id')
    .join('drugs', 'gene_drug_tissue.drug_id', 'drugs.drug_id')
    .join('datasets', 'gene_drug_tissue.dataset_id', 'datasets.dataset_id')
    .join('tissues', 'gene_drug_tissue.tissue_id', 'tissues.tissue_id');


// ************************************** Transform Functions *************************************************
const transformBiomarkerData = (data) => {
    return data.map((element) => ({
        id: element.id,
        estimate: element.estimate,
        ci_lower: element.ci_lower,
        ci_upper: element.ci_upper,
        pvalue: element.pvalue,
        fdr: element.fdr,
        n: element.n,
        mDataType: element.mDataType,
        metric: element.metric,
        gene: {
            id: element.gene_id,
            name: element.gene_name,
        },
        drug: {
            id: element.drug_id,
            name: element.drug_name,
        },
        tissue: {
            id: element.tissue_id,
            name: element.tissue_name,
        },
        dataset: {
            id: element.dataset_id,
            name: element.dataset_name,
        },
    }));
};

// ************************************** API Endpoints Functions ***************************************************
/**
 * 
 * @param {Object} request - request object
 * @param {Object} response - response object
 */
const getBiomarkers = async (request, response) => {
    // drug and gene query parameter
    const drug = request.query.drug.replace(/\s\s\s/g, ' + ');
    const { gene } = request.query;
    // data type parameter
    const dataType = request.query.dataType ?? '%%';

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
            .andWhere('drug_name', drug)
            .andWhere('mDataType', 'like', dataType);

        // updated/transformed biomarker data
        const transformedBiomarkerData = transformBiomarkerData(biomarkers);

        // send response
        response.status(200).json({
            status: 'success',
            data: transformedBiomarkerData,
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
