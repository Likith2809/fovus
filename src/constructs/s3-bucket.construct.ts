import { RemovalPolicy } from "aws-cdk-lib";
import { Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class S3BucketConstruct extends Construct{
    public readonly bucket : Bucket;

    constructor(scope: Construct, id:string){
        super(scope,id);

        this.bucket = new Bucket(this, 'myBucket', {
            bucketName : 'file-bucket-7782',
            encryption : BucketEncryption.S3_MANAGED,
            removalPolicy : RemovalPolicy.DESTROY,
        })
    }
}