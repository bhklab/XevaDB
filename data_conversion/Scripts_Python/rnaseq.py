import csv
import re


files = [   '../Final_csv_file/genes_final.csv', 
            '../Final_csv_file/sequencings_final.csv'
        ]

input_file = [
    '../Initial_csv_file/rna_sequencing/rna_sequencing_SU2C.csv',
    '../Initial_csv_file/rna_sequencing/rna_sequencing_TNBC.csv',
    '../Initial_csv_file/rna_sequencing/rna_sequencing_pdxe.csv',
]
output_file = '../Final_csv_file/rnasequencing_final.csv'

mapped_data = {}


for file in files:
    with open(file, 'r') as read_file:
        for line in read_file:
            data = line.split(',')
            mapped_data[data[1].replace('\n', '').replace('\r', '')] = data[0]


id = 0
total = 1
with open(output_file, 'w') as out_file:
    csv_writer = csv.writer(out_file, delimiter = ",")
    csv_writer.writerow(['id', 'gene_id', 'sequencing_uid', 'value'])
    #print(out_file.closed)

    for file in input_file:
        with open(file, 'r') as read_file:
            for line in read_file:
                if(re.search(r'\bgene.id\b', line)):
                        print('not useful')
                else:
                    line = (line.replace('"','').replace("\n", "")).replace("\r", "")
                    line = line.split(',')
                    gene = mapped_data[line[1].upper()]
                    sequencing = mapped_data[line[2]]
                    id = id + 1
                    csv_writer.writerow([id, gene, sequencing, line[3].replace('\n', '')])

