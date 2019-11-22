import csv
import re



input_file = '../../MP_XevaDB/drug_screening.csv'
output_file = '../../MP_XevaDB/drug_screening_final_mp.csv'

def readFile(readfile, writefile):
    value = 91575
    with open(readfile, 'r') as txt_file:
        with open(writefile, 'w') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter = ",")
            csv_writer.writerow(['id', 'model_id', 'drug','time', 'volume', 'volume_normal', 'patient_id'])
            for row in txt_file:
                if(re.search(r'\bpatient_id\b', row)):
                    print('not useful')
                else:
                    row = (row.replace('"','').replace("\n", "")).replace("\r", "")
                    row = row.split(',')
                    value = value + 1
                    csv_writer.writerow([value, row[0], row[1], row[2], row[3], row[4], row[5]])
                    
               
readFile(input_file, output_file)