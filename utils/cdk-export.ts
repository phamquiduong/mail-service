import { CfnOutput, Stack } from "aws-cdk-lib";

export function cdkExport(stack: Stack, env: string, name: string, value: string): void {
  new CfnOutput(stack, name, {
    value,
    exportName: `${env}-${name}`,
  });
}

export function cdkExports(stack: Stack, env: string, values: Record<string, string>): void {
  Object.entries(values).forEach(([name, value]) => cdkExport(stack, env, name, value));
}
