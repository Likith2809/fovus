import { S3, DynamoDB } from 'aws-sdk';

const s3 = new S3();
const dynamodb = new DynamoDB.DocumentClient();
const { nanoid } = require('nanoid');
exports.handler = async (event: any) => {
  try {
    console.log('Event Body:', event);
    const inputFile = event.inputFile;
    const inputText = event.inputText;

    let s3Key = '';
    if (inputFile) {
      const fileData = Buffer.from(inputFile.data, 'base64');

      const fileName = inputFile.name;
      const bucketName = process.env.BUCKET_NAME!;
      const s3Params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileData,
      };
      await s3.upload(s3Params).promise();
      s3Key = `${bucketName}/${fileName}`;
    }
    const id = nanoid();
    const tableParams = {
      TableName: process.env.TABLE_NAME!,
      Item: {
        id,
        input_text: inputText,
        input_file_path: s3Key,
        processedValue : "false",
      },
    };
    console.log("Adding into Table ");
    await dynamodb.put(tableParams).promise();
    console.log("Hello");
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ id }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'An error occurred' }),
    };
  }
};