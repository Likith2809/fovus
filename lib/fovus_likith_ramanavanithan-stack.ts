import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { S3BucketConstruct } from '../src/constructs/s3-bucket.construct';
import { DynamoDBTableConstruct } from '../src/constructs/dynamodb-table.construct';
import { APIGatewayConstruct } from '../src/constructs/api-gateway.construct';
import { UploadLambdaConstruct } from '../src/constructs/upload-lambda.construct';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ScriptLambdaConstruct } from '../src/constructs/script-lambda.construct';


export class FovusLikithRamanavanithanStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const bucket = new S3BucketConstruct(this, 'S3Bucket');

    const table = new DynamoDBTableConstruct(this, 'DynamoDBTable');

    const api = new APIGatewayConstruct(this, 'APIGateway');

    const uploadLambda = new UploadLambdaConstruct(this, 'UploadLambda', bucket, table);

    const uploadIntegration = new LambdaIntegration(uploadLambda.function);
    const uploadResource = api.api.root.addResource('upload');
    const response=uploadResource.addMethod('POST', uploadIntegration);
    
    const scriptLambda = new ScriptLambdaConstruct(this, 'ScriptLambda', table.table, bucket.bucket);

  }
}
