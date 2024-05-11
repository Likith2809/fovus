#!/bin/bash

id=$1
input_text=$2
input_file_path=$3

aws s3 cp s3://$input_file_path ./input_file.txt
echo "Downloading the input file from s3"

echo "$input_text" >> ./input_file.txt

output_file="output_${id}.txt"

mv ./input_file.txt ./$output_file

output_file_path="output/${output_file}"
aws s3 cp ./$output_file s3://$output_file_path

echo "Update the DynamoDB table with the output file path"
aws dynamodb update-item \
  --table-name fileTable \
  --key "{\"id\": {\"S\": \"$id\"}}" \
  --update-expression "SET output_file_path = :path" \
  --expression-attribute-values "{\":path\":{\"S\":\"$output_file_path\"}}"
