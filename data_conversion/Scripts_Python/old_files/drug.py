import csv
import re


input_file = '../../MP_XevaDB/drug_screening.csv'
output_file = '../../MP_XevaDB/drug_final_mp.csv'
unique_list = [] 

def readFile(readfile, writefile):
    with open(readfile, 'r') as txt_file:
        with open(writefile, 'w') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter = ",")
            csv_writer.writerow(['drug_id', 'standard_name', 'targets','treatment_type', 'pubchemId', 'class', 'class_name', 'source'])
            for row in txt_file:
                if(re.search(r'\bmodel_id\b', row)):
                    print('not useful')
                else:
                    row = (row.replace('"','').replace("\n", "")).replace("\r", "")
                    row = row.split(',')[2]
                    if row not in unique_list:
                            unique_list.append(row)

            for drug in unique_list:
                csv_writer.writerow([drug, drug, '', '', '', '', '', ''])
                    
               
readFile(input_file, output_file)