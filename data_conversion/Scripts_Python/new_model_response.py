import csv
import re


files = [   '../Final_Csv_File/models_final.csv', 
            '../Final_Csv_File/drugs_final.csv'
        ]

input_file = '../../../model_response.csv'
output_file = '../../../final_model_response.csv'

mapped_data = {}

for file in files:
    with open(file, 'r') as read_file:
        for line in read_file:
            data = line.split(',')
            mapped_data[data[1].replace('\n', '')] = data[0]


with open(input_file, 'r') as read_file:
    with open(output_file, 'w') as out_file:
        csv_writer = csv.writer(out_file, delimiter = ",")
        csv_writer.writerow(['id', 'drug_id', 'model_id', 'response_type', 'value'])
        for line in read_file:
            if(re.search(r'\bmodel_id\b', line)):
                    print('not useful')
            else:
                line = line.split(',')
                model = mapped_data[line[2]]
                drug = mapped_data[line[1]]
                csv_writer.writerow([1, drug, model, line[3], line[4].replace('\n', '')])





