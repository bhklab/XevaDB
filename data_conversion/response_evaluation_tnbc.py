import csv
import re


input_file = '../../TNBC_XevaDB/response_evaluation.csv'
output_file = '../../TNBC_XevaDB/final_response_evaluation_tnbc.csv'

def readFile(readfile, writefile):
    value = 6366
    with open(readfile, 'r') as txt_file:
        with open(writefile, 'w') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter = ",")
            csv_writer.writerow(['patient_id', 'drug', 'response'])
            for row in txt_file:
                if(re.search(r'\bpatient_id\b', row)):
                    print('not useful')
                else:
                    row = row.split(',')
                    patient_id = row[0]
                    drug = row[1]
                    for response in(row[2].replace("\n", "").replace("\r", "").split(';')):
                        if(response == 'PD' or response == 'PR' or response == 'SD' or response == 'CR' or response == 'NA'):
                            value = value + 1
                            csv_writer.writerow([value, patient_id, drug, response])

               
               
readFile(input_file, output_file)