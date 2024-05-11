import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, StreamViewType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DynamoDBTableConstruct extends Construct {
  public readonly table: Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new Table(this, 'FileTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      stream: StreamViewType.NEW_IMAGE,
    });

    this.table.addGlobalSecondaryIndex({
      indexName: 'input_file_path-index',
      partitionKey: { name: 'input_file_path', type: AttributeType.STRING },
    });

    this.table.addGlobalSecondaryIndex({
      indexName: 'processedValue-index',
      partitionKey: { name: 'processedValue', type: AttributeType.STRING },
    });
  }
}