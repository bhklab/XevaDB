import csv
import re


files = [   '../Final_Csv_File/genes_final.csv', 
            '../Final_Csv_File/sequencings_final.csv'
        ]

input_file = '../Initial_Csv_File/mutation_data/mutation.csv'
output_file = '../Final_Csv_File/mutation_final.csv'

mapped_data = {}


for file in files:
    with open(file, 'r') as read_file:
        for line in read_file:
            data = line.split(',')
            mapped_data[data[1].replace('\n', '').replace('\r', '')] = data[0]


id = 4167047
with open(input_file, 'r') as read_file:
    with open(output_file, 'w') as out_file:
        csv_writer = csv.writer(out_file, delimiter = ",")
        csv_writer.writerow(['id', 'gene_id', 'sequencing_uid', 'value'])
        for line in read_file:
            if(re.search(r'\bgene.id\b', line)):
                    print('not useful')
            else:
                line = (line.replace('"','').replace("\n", "")).replace("\r", "")
                line = line.split(',')
                gene = mapped_data[line[1]]
                sequencing = mapped_data[line[2]]
                id = id + 1
                csv_writer.writerow([id, gene, sequencing, line[3].replace('\n', '')])

