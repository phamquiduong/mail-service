import { Stack, StackProps } from "aws-cdk-lib"
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs"
import { cdkExport } from "../../utils/cdk-export"

interface DynamoDBStackProps extends StackProps {
  envName: string
  tableName: string
}

export class DynamoDBStack extends Stack {
  public readonly table: Table

  constructor(scope: Construct, id: string, props: DynamoDBStackProps) {
    super(scope, id, props)

    this.table = new Table(this, "EmailLogTable", {
      tableName: props.tableName,
      partitionKey: {
        name: "email_id",
        type: AttributeType.BINARY,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: "exp",
    })

    cdkExport(this, props.envName, "mail-service:table-name", this.table.tableName)
  }
}
