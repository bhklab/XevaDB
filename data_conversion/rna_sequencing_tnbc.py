import csv
import re


input_file = '../../TNBC_XevaDB/rna.csv'
output_file = '../../TNBC_XevaDB/final_rna_tnbc.csv'

def readFile(readfile, writefile):
    value = 0
    with open(readfile, 'r') as txt_file:
        with open(writefile, 'w') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter = ",")
            csv_writer.writerow(['id', 'gene_id', 'patient_id','expression'])
            for row in txt_file:
                if(re.search(r'\bpatient_id\b', row)):
                    print('not useful')
                else:
                    row = (row.replace('"','').replace("\n", "")).replace("\r", "")
                    row = row.split(',')
                    value = value + 1
                    csv_writer.writerow([value, row[0], row[1], row[2]])
                    
               
readFile(input_file, output_file)