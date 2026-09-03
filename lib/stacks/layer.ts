import { Stack, StackProps } from "aws-cdk-lib"
import { Code, LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda"
import { Construct } from "constructs"

export class LayerStack extends Stack {
  public readonly powerToolsLayer: LayerVersion

  private readonly runTime: Runtime = Runtime.PYTHON_3_14
  private readonly powerToolsLayerPath: string = "layers/powertools"

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    this.powerToolsLayer = new LayerVersion(this, "SendMailLayer", {
      code: Code.fromAsset(this.powerToolsLayerPath),
      compatibleRuntimes: [this.runTime],
    })
  }
}
