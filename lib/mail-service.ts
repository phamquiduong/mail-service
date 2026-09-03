import { Stack, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { requiredEnv } from "../utils/env"
import { DynamoDBStack } from "./stacks/dynamodb"
import { LambdaStack } from "./stacks/lambda"
import { SQSStack as QueueStack } from "./stacks/sqs"

interface MailServiceStackProps extends StackProps {
  envName: string
}

export class MailServiceStack extends Stack {
  constructor(scope: Construct, id: string, props: MailServiceStackProps) {
    super(scope, id, props)

    const dynamoDBStack = new DynamoDBStack(
      scope,
      `${props.envName}-DynamoDBStack`,
      {
        tableName: `${props.envName}-email-log`,
      },
    )

    const queueStack = new QueueStack(scope, `${props.envName}-QueueStack`)

    const lambdaStack = new LambdaStack(scope, `${props.envName}-LambdaStack`, {
      emailSource: requiredEnv("EMAIL_SOURCE"),
      emailLogTable: dynamoDBStack.table,
      queue: queueStack.queue,
    })
  }
}
