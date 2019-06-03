#!/bin/bash

## this will copy the files from different folders to corresponding folders.
OIFS="$IFS"
IFS=$'\n'
for f in ~/Desktop/dataForXevaDB/*;
do
    for filename in $f/*.csv
    do
    result=${filename%%+(/)}          # trim however many trailing slashes exist
    result=${result##*/}              # remove everything before the last / that still remains
    result=${result// /}
    echo "filename is $result"
    if [[ $result == *"RNASeq"* ]]; then
    cp $filename ~/Desktop/XevaDB/data_conversion/Initial_csv_file/RNASeq_data
    elif [[ $result == *"batchInfo"* ]]; then
    cp $filename ~/Desktop/XevaDB/data_conversion/Initial_csv_file/batch_information
    elif [[ $result == *"cnv"* ]]; then
    cp $filename ~/Desktop/XevaDB/data_conversion/Initial_csv_file/copy_number_variation
    elif [[ $result == *"growthData"* ]]; then
    cp $filename ~/Desktop/XevaDB/data_conversion/Initial_csv_file/drug_screening
    elif [[ $result == *"mRECIST_modelId"* ]]; then
    cp $filename ~/Desktop/XevaDB/data_conversion/Initial_csv_file/responseevaluation_modelid_mapping
    elif [[ $result == *"mRECIST"* ]]; then
    cp $filename ~/Desktop/XevaDB/data_conversion/Initial_csv_file/response_evaluation
    elif [[ $result == *"model.id_to_moleculerData"* ]]; then
    cp $filename ~/Desktop/XevaDB/data_conversion/Initial_csv_file/modelid_moleculardata_mapping
    elif [[ $result == *"modelInfo"* ]]; then
    cp $filename ~/Desktop/XevaDB/data_conversion/Initial_csv_file/model_information
    elif [[ $result == *"mutation"* ]]; then
    cp $filename ~/Desktop/XevaDB/data_conversion/Initial_csv_file/sequencing_data
    fi 
    done
done