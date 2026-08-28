import { Duration, Stack, StackProps } from "aws-cdk-lib"
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda"
import { Construct } from "constructs"

interface LambdaStackProps extends StackProps {
  runTime?: Runtime
  lambdaCodePath?: string
  emailSource: string
}

export class LambdaStack extends Stack {
  public readonly func: Function

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props)

    this.func = new Function(this, "SendMailLambda", {
      runtime: props.runTime ?? Runtime.PYTHON_3_14,
      handler: "main.handler",
      code: Code.fromAsset(props.lambdaCodePath ?? "func"),
      timeout: Duration.seconds(30),
      memorySize: 256,
      environment: {
        EMAIL_SOURCE: props.emailSource,
      },
    })
  }
}
