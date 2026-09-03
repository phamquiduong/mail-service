import { Duration, Stack, StackProps } from "aws-cdk-lib"
import { Table } from "aws-cdk-lib/aws-dynamodb"
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam"
import { Code, Function, LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda"
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources"
import { Queue } from "aws-cdk-lib/aws-sqs"
import { Construct } from "constructs"

interface LambdaStackProps extends StackProps {
  emailSource: string
  emailLogTable: Table
  queue: Queue
  powerToolsLayer: LayerVersion
}

export class LambdaStack extends Stack {
  public readonly lambdaFn: Function

  private readonly runTime: Runtime = Runtime.PYTHON_3_14
  private readonly lambdaCodePath: string = "func"

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props)

    this.lambdaFn = new Function(this, "SendMailLambda", {
      runtime: this.runTime,
      handler: "main.handler",
      code: Code.fromAsset(this.lambdaCodePath),
      timeout: Duration.seconds(30),
      memorySize: 256,
      environment: {
        EMAIL_SOURCE: props.emailSource,
        EMAIL_LOG_TABLE: props.emailLogTable.tableName,
      },
      layers: [props.powerToolsLayer],
    })

    this.lambdaFn.addEventSource(
      new SqsEventSource(props.queue, {
        batchSize: 1,
      }),
    )

    this.lambdaFn.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: ["*"],
      }),
    )

    props.emailLogTable.grantReadWriteData(this.lambdaFn)
  }
}
