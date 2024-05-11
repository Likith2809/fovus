import { Construct } from "constructs";
import { S3BucketConstruct } from "./s3-bucket.construct";
import { DynamoDBTableConstruct } from "./dynamodb-table.construct";
import { Runtime, Code, Function } from "aws-cdk-lib/aws-lambda";

export class UploadLambdaConstruct extends Construct{
    public readonly function: Function;

    constructor(
        scope:Construct,
        id:string,
        bucket:S3BucketConstruct,
        table : DynamoDBTableConstruct
    ){
        super(scope,id);

        this.function = new Function(this, 'UploadFunction',{
            runtime : Runtime.NODEJS_16_X,
            code: Code.fromAsset('src/lambda/upload'),
            handler:'index.handler',
            environment : {
                BUCKET_NAME : bucket.bucket.bucketName,
                TABLE_NAME : table.table.tableName,
            },
        });

        bucket.bucket.grantReadWrite(this.function);
        table.table.grantWriteData(this.function);
    }
}