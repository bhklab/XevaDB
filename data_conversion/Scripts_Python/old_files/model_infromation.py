import csv
import re



input_file = '../../MP_XevaDB/model_information.csv'
output_file = '../../MP_XevaDB/model_information_final_mp.csv'


def readFile(readfile, writefile):
    with open(readfile, 'r') as txt_file:
        with open(writefile, 'w') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter = ",")
            csv_writer.writerow(['model_id', 'tissue_id', 'tissue', 'patient_id', 'drug', 'tested', 'dataset'])
            for row in txt_file:
                if(re.search(r'\bpatient_id\b', row)):
                    print('not useful')
                else:
                    row = (row.replace('"','').replace("\n", ""))
                    row = (row.split("\t"))
                    row.pop(0)
                    csv_writer.writerow(row)

               
               
readFile(input_file, output_file)