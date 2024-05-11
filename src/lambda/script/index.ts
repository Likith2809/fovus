import { S3, DynamoDB, EC2 } from 'aws-sdk';
import AWS = require('aws-sdk');

const s3 = new S3();
const dynamodb = new DynamoDB.DocumentClient();
const ec2 = new EC2();

exports.handler = async (event: any) => {
  const record = event.Records[0];
  console.log("record :" + JSON.stringify(event.Records[0]));

  const { id, input_text, input_file_path, processedValue } = record.dynamodb.NewImage;
  console.log(record.dynamodb.NewImage);

  if (processedValue.S === 'true') {
    console.log(`Record ${id.S} has already been processedValue. Skipping.`);
    return;
  }
  console.log("Hello");
  
  const updateParams: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: process.env.TABLE_NAME!,
    Key: {
      id: id.S
    },
    UpdateExpression: 'SET processedValue = :processedValue',
    ExpressionAttributeValues: {
      ':processedValue': 'true'
    },
    ConditionExpression: 'attribute_exists(id)'
  };
  
  try {
    await dynamodb.update(updateParams).promise();
    console.log(`Record ${id.S} processedValue key updated to true.`);
  } catch (error) {
    console.error(`Error updating record ${id.S}:`, error);
    throw error;
  }

  const bucketName = process.env.BUCKET_NAME!;

  console.log(`${id.S} "${input_text.S}" ${input_file_path.S}`)

  const instanceParams: EC2.RunInstancesRequest = {
    ImageId: 'ami-0cff7528ff583bf9a',
    InstanceType: 't2.micro',
    MinCount: 1,
    MaxCount: 1,
    TagSpecifications: [
      {
        ResourceType: 'instance',
        Tags: [
          {
            Key: 'Name',
            Value: `ScriptInstance-${id.S}`,
          },
        ],
      },
    ],
    IamInstanceProfile: {
      Name: 'ec2Role'
  }
  };
  const { Instances } = await ec2.runInstances(instanceParams).promise();
  if (!Instances || Instances.length === 0) {
    console.error('Failed to create EC2 instance');
    return;
  }
  const instanceId = Instances[0].InstanceId!;
  console.log("Instance Created");
  await new Promise(resolve => setTimeout(resolve, 60000));

  console.log("Instance Running, Now executing the script", instanceId);

    const ssmParams = {
      InstanceIds: [instanceId],
      DocumentName: 'AWS-RunShellScript',
      Parameters: {
        commands: [
          `aws s3 cp s3://${bucketName}/script.sh /home/ec2-user/script.sh`,
          'chmod +x /home/ec2-user/script.sh',
          `/home/ec2-user/script.sh "${id.S}" "${input_text.S}" "${input_file_path.S}"`,
        ],
      },
    };
    const ssm = new AWS.SSM();
    const commandResult = await ssm.sendCommand(ssmParams).promise();
    console.log("SSM command sent successfully", commandResult.Command?.CommandId);

    console.log("Waiting for script execution to complete...");
    await new Promise(resolve => setTimeout(resolve, 60000)); 

    console.log("Terminating the instance");
  
    await ec2.terminateInstances({ InstanceIds: [instanceId] }).promise();
};