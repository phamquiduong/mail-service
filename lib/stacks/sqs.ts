import { Duration, Stack, StackProps } from "aws-cdk-lib"
import { Queue } from "aws-cdk-lib/aws-sqs"
import { Construct } from "constructs"
import { cdkExport } from "../../utils/cdk-export"

interface SQSStackProps extends StackProps {
  envName: string
}

export class SQSStack extends Stack {
  public readonly queue: Queue
  private readonly dlq: Queue

  constructor(scope: Construct, id: string, props: SQSStackProps) {
    super(scope, id, props)

    this.dlq = new Queue(this, "SendMailDeadLetterQueue", {
      retentionPeriod: Duration.days(14),
    })

    this.queue = new Queue(this, "SendMailQueue", {
      visibilityTimeout: Duration.seconds(60),
      receiveMessageWaitTime: Duration.seconds(20),
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: this.dlq,
      },
    })

    cdkExport(this, props.envName, "mail-service:sqs-url", this.queue.queueUrl)
  }
}
