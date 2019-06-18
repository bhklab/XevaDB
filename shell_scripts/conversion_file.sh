#!/bin/bash

## this code will convert the files in particular format.
OIFS="$IFS"
IFS=$'\n'
for f in ~/Desktop/dataForXevaDB/*;
do
  # echo "Processing $f file..."
  result=${f%%+(/)}          # trim however many trailing slashes exist
  result=${result##*/}       # remove everything before the last / that still remains
  result=${result// /}
  # printf '%s\n' "$result"
    for filename in $f/*.csv
    do
    if [[ $filename == *"$result"* ]]; then
    else
      mv $filename ${filename%.csv}_$result.csv; 
    fi   
    done
done