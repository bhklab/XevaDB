import csv
import re


input_file = '../../MP_XevaDB/model_information.csv'
output_file = '../../final_patient_information_tnbc.csv'
unique_list = [] 

def readFile(readfile, writefile):
    with open(readfile, 'r') as txt_file:
        with open(writefile, 'w') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter = ",")
            csv_writer.writerow(['patient_id', 'sex', 'age', 'biopsy'])
            for row in txt_file:
                if(re.search(r'\bpatient_id\b', row)):
                    print('not useful')
                else:
                    row = row.split(',')[3]
                    if row not in unique_list:
                        unique_list.append(row)
                    
            for patient_id in unique_list:
                csv_writer.writerow([patient_id, 'M', 1, 'cancer'])
                    

               
               
readFile(input_file, output_file)