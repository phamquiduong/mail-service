# Email services
Send mail by AWS SQS and Lambda

```
Client
  │
  ▼
DynamoDB ── record_id ──▶ SQS
                           │
                           ▼
                        Lambda
                           │
                           ├──▶ DynamoDB (get record)
                           │
                           └──▶ SES ──▶ Email
```

<br>

---

### Project structure
```
mail-service/
├── func/                   # Git submodule - Lambda function
├── bin/
├── lib/
│   ├── stacks/
│   │   ├── dynamodb.ts
│   │   ├── lambda.ts
│   │   └── sqs.ts
│   └── mail-service.ts
└── utils/
```

<br>

---

### Clone sub repo in git
```
git submodule update --init --recursive
```

<br>

---

### Install Node module
```
npm i
```

<br>

---

### Config environment
- `bin\mail-service.ts`
    - Update `const ENV_NAME = "dev"` to **your environment name**.
- Create `.env.<your environment name>`, example `.env.dev`
    - `EMAIL_SOURCE`: SES email source

<br>

---

### Useful commands

* `npm run build`   type-check the project
* `npm run watch`   watch for changes and type-check
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
