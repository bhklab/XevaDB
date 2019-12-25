import csv
import re


files = [ 
            '../Initial_csv_file/mutation_data/mutation_data_pdxe.csv', 
            '../Initial_csv_file/mutation_data/mutation_data_TNBC.csv',
            '../Initial_csv_file/rna_sequencing/rna_sequencing_pdxe.csv',
            '../Initial_csv_file/rna_sequencing/rna_sequencing_SU2C.csv',
            '../Initial_csv_file/rna_sequencing/rna_sequencing_TNBC.csv',
            '../Initial_csv_file/copy_number_variation/copy_number_variation_pdxe.csv',
            '../Initial_csv_file/copy_number_variation/copy_number_variation_TNBC.csv',
            '../Initial_csv_file/copy_number_variation/copy_number_variation_SU2C.csv',
            '../Initial_csv_file/mutation_data/mutation_data_SU2C.csv',
            #'../Initial_csv_file/abctest.csv'
        ]

output_file = '../Final_csv_file/genes_final.csv'
gene_list = {}
unique_list = []
value = 0
counter = 1

for file in files:
    with open(file, 'r') as read_file:
        for row in read_file:
            #print(row)
            row = (row.replace('"','').replace("\n", "")).replace("\r", "")
            row = row.split(',')[1].upper()
            if(re.search(r'\bGENE.ID\b', row)):
                    print('not useful')
            elif(not gene_list.get(row)):
                    gene_list[row] = counter
                    counter+=1

unique_list = gene_list.keys()
unique_list.sort()


with open(output_file, 'w') as csv_file:
    csv_writer = csv.writer(csv_file, delimiter = ",")
    csv_writer.writerow(['gene_id', 'gene_name'])
    for gene in unique_list:
        value = value + 1
        csv_writer.writerow([value, gene])
        
