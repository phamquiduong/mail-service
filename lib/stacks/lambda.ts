import { Duration, Stack, StackProps } from "aws-cdk-lib"
import { Table } from "aws-cdk-lib/aws-dynamodb"
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam"
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda"
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources"
import { Queue } from "aws-cdk-lib/aws-sqs"
import { Construct } from "constructs"

interface LambdaStackProps extends StackProps {
  runTime?: Runtime
  lambdaCodePath?: string
  emailSource: string
  emailLogTable: Table
  queue: Queue
}

export class LambdaStack extends Stack {
  public readonly lambdaFn: Function

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props)

    this.lambdaFn = new Function(this, "SendMailLambda", {
      runtime: props.runTime ?? Runtime.PYTHON_3_14,
      handler: "main.handler",
      code: Code.fromAsset(props.lambdaCodePath ?? "func"),
      timeout: Duration.seconds(30),
      memorySize: 256,
      environment: {
        EMAIL_SOURCE: props.emailSource,
        EMAIL_LOG_TABLE: props.emailLogTable.tableName,
      },
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
