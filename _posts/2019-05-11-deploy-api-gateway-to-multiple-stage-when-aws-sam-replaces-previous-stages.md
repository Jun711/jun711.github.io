---
layout: single
header:
  teaser: /assets/images/aws-api-gateway-logo-2018-11-11.png
title: "Deploy AWS API to Multiple Stages When AWS SAM Replaces Previous Stages"
date: 2019-06-15 20:00:00 -0800
categories: AWS
tags:
  - AWS CodePipeline
  - AWS API Gateway
  - AWS Lambda
  - serverless
  - CI/CD
---

## Overview:
Learn how to create multiple API Gateway deployment stages even though AWS SAM replaces previous stages in subsequent deployments.   

Note that this is a workaround to AWS SAM template replaces previously deployed stage when you change API StageName property on yaml. It is probably not an optimal solution as it involves an extra step after deployment via CodePipeline.   

## Steps
Follow the following steps to adopt this workaround.

### 1. Specify Stage Name
In your yaml file, specify stage name that you want CodePipeline to deploy to. For example, set it as 'Prod' if you want it to deploy to `Prod` stage.   

```yaml
MyApi:
  Type: AWS::Serverless::Api
  Properties:
    StageName: Prod
```

### 2. Create Another Stage
Open AWS API Gateway console and select your API. Then, click `Actions` button to open up a menu and select `Deploy API`.  

![AWS API Gateway Console Integration Request](/assets/images/2019-05-11-deploy-api-gateway-to-multiple-stage-when-aws-sam-replaces-previous-stages/aws-api-gateway-console-actions.png)

Specify your desired deployment stage name and description before deploying your API. Click `Deploy` to deploy your API.  

![AWS API Gateway Console Integration Request](/assets/images/2019-05-11-deploy-api-gateway-to-multiple-stage-when-aws-sam-replaces-previous-stages/aws-api-gateway-deploy-api.png)

### 3. New Stage
You have deployed your API to a new stage. The associated invoke url will contain the stage name you set in the previous step.  

![AWS API Gateway Console Integration Request](/assets/images/2019-05-11-deploy-api-gateway-to-multiple-stage-when-aws-sam-replaces-previous-stages/aws-api-gateway-api-stages.png)

### 4. Future Deployment
For future deployments, after you deploy using CodePipeline, it will only deploy to the stage specified on your yaml file. It will not affect the stage you manually deployed on AWS API Gateway console.  

#### 4.1 AWS API Gateway Console
Thus, to deploy to your manually deployed stage, you have to go to API Gateway and repeat step 2.  

#### 4.2 AWS API Gateway CLI
You can also deploy your API using AWS API Gateway CLI `create-deployment` command.    

<pre class='code'>
<code>
aws apigateway create-deployment \
--rest-api-id YOUR_API_NAME --stage-name YOUR_STAGE_NAME

</code></pre>    

AWS API Gateway [create-deployment](https://docs.aws.amazon.com/cli/latest/reference/apigateway/create-deployment.html){:target="view_window"} CLI summary:   

```

create-deployment
--rest-api-id <value>
[--stage-name <value>]
[--stage-description <value>]
[--description <value>]
[--cache-cluster-enabled | --no-cache-cluster-enabled]
[--cache-cluster-size <value>]
[--variables <value>]
[--canary-settings <value>]
[--tracing-enabled | --no-tracing-enabled]
[--cli-input-json <value>]
[--generate-cli-skeleton <value>]

```

## Summary
With this setup, your future deployments via CodePipeline won't affect the stages you define manually on AWS API Gateway console. However, to add new changes to these manually added stages, you have to go to AWS console or use API Gateway CLI to redeploy your API.   

Good thing about this method is your deployment will not affect stages that you manually deploy.  

{% include eof.md %}
