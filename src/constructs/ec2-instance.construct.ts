import { Instance, MachineImage, Vpc, InstanceType, InstanceClass, InstanceSize } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class EC2InstanceConstruct extends Construct {
    public readonly ec2Instance: Instance;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const vpc = Vpc.fromLookup(this, 'VPC', { isDefault: true });

        const machineImage = MachineImage.latestAmazonLinux2();

        this.ec2Instance = new Instance(this, 'ScriptInstance', {
            instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            machineImage: machineImage,
            vpc,
        });
    }
}
