#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core"
import dotenv from "dotenv"
import { MailServiceStack } from "../lib/mail-service"

const ENV_NAME = "dev"
dotenv.config({
  path: `.env.${ENV_NAME}`,
})

console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀  DEPLOYMENT STARTED
You are deploying to environment: ${ENV_NAME}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

const app = new cdk.App()
new MailServiceStack(app, `${ENV_NAME}-MailServiceStack`, {
  envName: ENV_NAME,
})
