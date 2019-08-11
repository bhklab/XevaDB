import csv
import re


input_file = './Final_Csv_File/modelid_moleculardata_mapping_final.csv'
output_file = './Final_Csv_File/modelid_moleculardata_mapping_final1.csv'

def readFile(readfile, writefile):
    value = 0
    with open(readfile, 'r') as txt_file:
        with open(writefile, 'w') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter = ",")
            csv_writer.writerow(['id', 'model_id', 'biobase_id','mDataType'])
            for row in txt_file:
                if(re.search(r'\bmodel_id\b', row)):
                    print('not useful')
                else:
                    row = (row.replace('"','').replace("\n", "")).replace("\r", "")
                    row = row.split(',')
                    value = value + 1
                    csv_writer.writerow([value, row[0], row[1], row[2]])
                    
               
readFile(input_file, output_file)