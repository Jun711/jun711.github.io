---
layout: single
header:
  teaser: /assets/images/aws-api-gateway-logo-2018-11-11.png
title: "AWS API Gateway Invoke Lambda Function Permission"
date: 2019-05-21 20:00:00 -0800
categories: AWS
tags:
  - AWS API Gateway
  - AWS Lambda
  - AWS Serverless Application Model(AWS SAM)
---
Learn how to provide API Gateway permission to invoke Lambda function(s).

## Issue
API Gateway endpoint can't invoke Lambda with 5XX permission error.

When testing on API Gateway console, you see this error message:
```
Execution log for request d237e276-656e-11e9-aaff-51e803313fb3
... truncated
Date : Sending request to https://lambda.function.url
Date : Execution failed due to configuration error: 
  Invalid permissions on Lambda function
Date : Method completed with status: 500
```

## Expected Behavior
Published API on API Gateway is able to invoke AWS Lambda functions successfully.

## Reason
Why didn't it work? The reason is we have to explicitly specify the ARN of an IAM role for API Gateway to assume when invoking a Lambda function. If none is specified, resource-based permissions are needed.   

Quoting [AWS x-amazon-apigateway-integration Object document](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-swagger-extensions-integration.html){:target="_blank"}:

> For AWS IAM role-based credentials, specify the ARN of an appropriate IAM role. If unspecified, <b>credentials will default to resource-based permissions that must be added manually to allow the API to access the resource</b>. For more information, see Granting Permissions Using a Resource Policy. 

## Solutions
### 1. AWS Console
You can add a resource based policy for your API Gateway to invoke your Lambda function on AWS API Gateway console. 

These are the steps to add a resource based policy. On API Gateway console, select your API then resources on left panel. Your API configuration menu will be displayed on the right like the image below.

![AWS API Gateway Console Integration Request](/assets/images/2019-04-20-aws-api-gateway-invoke-lambda-function-permission/aws-console-api-gateway-lambda-integration-request.png)

Afterwards, choose the method you want to add a policy to. Select Integration Request item and the following menu will appear. Notice that there is a Lambda Function item in the middle, click the pencil icon on its right end to edit.

![AWS API Gateway Console Integration Request](/assets/images/2019-04-20-aws-api-gateway-invoke-lambda-function-permission/aws-console-api-gateway-lambda-integration-request-edit-lambda-function.png)

After the pencil icon is clicked, it will become an editable field. Once you click the check mark to the right of the field, there will be a popup with title 'Add Permission to Lambda Function' saying that 'You are about to give API Gateway permission to invoke your Lambda function: Function-ARN'.   

Once you click OK on the popup, a resource based policy will be added to Lambda function.  

![AWS API Gateway Console Add Resource based policy](/assets/images/2019-04-20-aws-api-gateway-invoke-lambda-function-permission/aws-console-add-resource-based-policy-for-api-gateway-to-invoke-lambda.png)

#### Issues
1. Note that a resource based policy will be added each time you do the above steps even though it is the same policy. 

2. There is this `The final policy size is bigger than the limit(20480)` limit that might happen when there are too many(same or different) policies added to a Lambda Function. Check out [this article](https://jun711.github.io/aws/aws-api-gateway-final-policy-size-bigger-than-limit-20480/){:target="_blank"} on how to fix this limit error.

3. Adding permission for API Gateway to invoke Lambda functions manually by clicking doesn't scale well when we have more API endpoints. To minimize operational overhead, I recommend the following 2 methods. 

### 2. Resource-based Policy
On the other hand, you can declare a permission entity in your yaml file. By adding a resource-based policy in your yaml file, a resource-based policy will be attached to your lambda function(s). The following is the `AWS::Lambda::Permission` entity that you need to add to your yaml file. Read more about [Lambda Permission on AWS document](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html){:target="_blank"}.

Note that if you use resource-based policy, you will have to attach at least one per lambda function. There is still a chance that your policy size reaches 20KB limit.

```yaml
YourLambdaFunctionName:
  Type: AWS::Serverless::Function
  Properties:
    ...
  
YourAPIName:
  Type: AWS::Serverless::Api
  Properties:
    ...

ApiGatewayInvokeLambdaPermission:
  Type: "AWS::Lambda::Permission"
  Properties: 
    Action: lambda:InvokeFunction
    FunctionName: !GetAtt 
      - YourLambdaFunctionName
      - Arn
    Principal: apigateway.amazonaws.com
    SourceArn: !Join [
      "", [
        "arn:aws:execute-api:", 
        {"Ref": "AWS::Region"}, ":", 
        {"Ref": "AWS::AccountId"}, ":", 
        !Ref YourAPIName, "/*/*/*"
        ]
      ] 
```
You can use AWS Lambda CLI [get-policy](https://docs.aws.amazon.com/cli/latest/reference/lambda/get-policy.html){:target="_blank"} to check if the policy is attached successfully.

### 3. IAM Role
Another way is to create an IAM role that allows `lambda:InvokeFunction` action and trust API Gateway service `apigateway.amazonaws.com`.  

#### AWS IAM Console
1. Go to AWS IAM console and click `Create Role`. Afterwards, choose AWS service and Lambda.  
![AWS IAM Create Role Choose Service](/assets/images/2019-04-20-aws-api-gateway-invoke-lambda-function-permission/aws-iam-create-role-choose-service-2019-04-20.png)

2. Attach permissions policies that you need. Filter for AWS managed policy: AWSLambdaRole that allows `lambda:InvokeFunction` for all resources or specified Lambda functions. You can also attach other policies that you need such as CloudWatchLogsFullAccess in my case.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```

![AWS IAM Create Role Attach Permissions Policies](/assets/images/2019-04-20-aws-api-gateway-invoke-lambda-function-permission/aws-iam-create-role-attach-permission-policies-2019-04-20.png)

{:start="3"}
3. Tag your AWS IAM role for management purpose and click next to review.  
![AWS IAM Create Role Tagging](/assets/images/2019-04-20-aws-api-gateway-invoke-lambda-function-permission/aws-iam-create-role-tagging-2019-04-20.png)

{:start="4"}
4. Give your role a name such as ApiGatewayInvokeLambdaRole and review the role that you are about to create.
![AWS IAM Review Role Creation](/assets/images/2019-04-20-aws-api-gateway-invoke-lambda-function-permission/aws-iam-create-role-review-role-2019-04-20.png)

{:start="5"}
5. Edit Trust Relationships so that this role trusts apigateway.amazonaws.com.    

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```   

![AWS IAM Create Role Trust Relationships](/assets/images/2019-04-20-aws-api-gateway-invoke-lambda-function-permission/aws-iam-create-role-trust-api-gateway-2019-04-20.png)

These are all the steps needed to create a role on AWS console.

#### AWS IAM CLI
You can use AWS IAM [create-role](https://docs.aws.amazon.com/cli/latest/reference/iam/create-role.html){:target="_blank"} and [attach-role-policy](https://docs.aws.amazon.com/cli/latest/reference/iam/attach-role-policy.html){:target="_blank"} command.

1. Create role using the following trust relationship object.

<pre class='code'>
<code>aws iam create-role
--role-name ApiGatewayInvokeLambdaRole
--assume-role-policy-document ./trust-api-gateway.json
</code></pre>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```
{:start="2"}
2. Then, attach AWSLambdaRole role policy.  
<pre class='code'>
<code>aws iam attach-role-policy 
--policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaRole
--role-name ApiGatewayInvokeLambdaRole
</code></pre>

If you want to use CloudWatch for your API Gateway log, you can attach CloudWatchLogsFullAccess role policy too.
<pre class='code'>
<code>aws iam attach-role-policy    
--policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess
--role-name ApiGatewayInvokeLambdaRole
</code></pre>

#### Assign Role in YAML / JSON
After creating a role using AWS console or CLI, assign the ARN of your role to the credential item in the x-amazon-apigateway-integration definition of your API yaml file. The ARN of your role looks like this: `"arn:aws:iam::ACC_NUM:role/IAM_ROLE_NAME"`.

```yaml
MyApi:
  Type: AWS::Serverless::Api
  Properties:
    StageName: Prod
    DefinitionBody:
      swagger: '2.0'
      basePath: '/Prod'
      schemes: 
      - 'https'
      paths:
        /myMethod:
          post:
            produces:
            - "application/json"
            responses: {}
            x-amazon-apigateway-integration:
              uri: # api-gateway-arn using Fn::Join
              responses: {}
              httpMethod: "POST"
              credentials: "arn:aws:iam::ACC_NUM:role/ApiGatewayInvokeLambdaRole"
              type: "aws_proxy"
```
## Summary
I suggest using a resource-based policy or an IAM role to minimize operational overhead.

{% include eof.md %}
