import re


input_file = [ './GeneList.js' ]
output_file = './GeneListTraversed.txt'


id = 0
final_data = []

for file in input_file:
    with open(file, 'r') as read_file:
        for line in read_file:
            data = line.replace('"','').replace("\n", "").replace("',", "").split('=')[1].split(' ')
            for val in data:
                print(val)
                if val not in final_data:
                    final_data.append(val)

final_data.sort()

with open(output_file, 'w') as write_file:
    write_file.writelines('[')
    for gene in final_data:
        write_file.write("'" + gene + "'" + ',')
    write_file.writelines(']')

