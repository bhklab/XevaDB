import csv
import re

files = [ 
    '../Initial_csv_file/mutation_data/mutation_data_pdxe.csv',
    '../Initial_csv_file/mutation_data/mutation_data_TNBC.csv',
    '../Initial_csv_file/rna_sequencing/rna_sequencing_SU2C.csv',
    '../Initial_csv_file/rna_sequencing/rna_sequencing_TNBC.csv',
    '../Initial_csv_file/rna_sequencing/rna_sequencing_pdxe.csv',
    '../Initial_csv_file/copy_number_variation/copy_number_variation_pdxe.csv',
    '../Initial_csv_file/copy_number_variation/copy_number_variation_TNBC.csv'
]

output_file = '../Final_csv_file/sequencings_final.csv'
unique_list = []
value = 0

for file in files:
    with open(file, 'r') as read_file:
        for row in read_file:
            #print(row)
            if(re.search(r'\bgene.id\b', row)):
                    print('not useful')
            else:
                    row = (row.replace('"','').replace("\n", "")).replace("\r", "")
                    row = row.split(',')[2]
                    if row not in unique_list:
                            unique_list.append(row)
#print(unique_list)

with open(output_file, 'w') as csv_file:
    csv_writer = csv.writer(csv_file, delimiter = ",")
    csv_writer.writerow(['sequencing_uid', 'sequencing_id'])
    for id in unique_list:
        value = value + 1
        csv_writer.writerow([value, id])
        
