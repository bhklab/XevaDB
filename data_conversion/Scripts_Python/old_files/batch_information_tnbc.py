import csv
import re


input_file = '../../TNBC_XevaDB/batch_information.csv'
output_file = '../../TNBC_XevaDB/batch_information_tnbc.csv'

def readFile(readfile, writefile):
    value = 8451
    with open(readfile, 'r') as txt_file:
        with open(writefile, 'w') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter = ",")
            csv_writer.writerow(['id', 'batch', 'model_id','type'])
            for row in txt_file:
                if(re.search(r'\bmodel_id\b', row)):
                    print('not useful')
                else:
                    row = (row.replace('"','').replace("\n", "")).replace("\r", "")
                    row = row.split(',')
                    value = value + 1
                    csv_writer.writerow([value, row[0], row[1], row[2]])
                    
               
readFile(input_file, output_file)