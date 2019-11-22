import csv
import re


files = [   '../Initial_Csv_File/mutation_data/mutation.csv', 
            '../Initial_Csv_File/RNASeq_data/rna_sequencing.csv'
            # '../Initial_Csv_File/extrafiles/mutation.csv', 
            # '../Initial_Csv_File/extrafiles/rna_sequencing.csv'
        ]

output_file = '../Final_Csv_File/genes_final.csv'
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
                    row = row.split(',')[1]
                    if row not in unique_list:
                            unique_list.append(row)
#print(unique_list)

with open(output_file, 'w') as csv_file:
    csv_writer = csv.writer(csv_file, delimiter = ",")
    csv_writer.writerow(['gene_id', 'gene_name'])
    for gene in unique_list:
        value = value + 1
        csv_writer.writerow([value, gene])
        
