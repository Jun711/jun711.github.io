---
layout: single
header:
  teaser: /assets/images/teasers/lambda.png
title: "Add AWS Lambda Layers to a Lambda Function using AWS SAM"
date: 2019-12-06 20:00:00 -0800
categories: AWS
tags:
  - AWS Lambda
  - serverless
  - AWS SAM
  - AWS CloudFormation
---
Learn how to attach a Lambda Layer to a Lambda Function using AWS SAM (Serverless Application Model) and AWS console.

## Create Lambda Layers
If you haven't created a Lambda Layer, you can read [Create AWS Lambda Layers article](https://jun711.github.io/aws/create-aws-lambda-layers-using-aws-sam-yaml-tutorial/){:target="view_window"} to learn how to create a Lambda Layer.   

## AWS Console
After creating a Lambda Layer, you can add it to a Lambda function via AWS console. Follow the steps below to add a Layer to your Lambda function. The screenshots below were taken on 2019/12/06.  

1. Go to AWS Console and open your Lambda function.

2. On the `Designer` panel, press `Layers`.

3. And, a new menu with `Add a Layer` button will appear.
![AWS Lambda Layers Folder Structure](/assets/images/2019-12-06-attach-aws-layers-to-lambda-using-aws-sam-yaml-tutorial/aws-console-lambda-add-a-layer.png)

{:start="5"}
4. Press on `Add a Layer` to open up a menu to add a Layer. On this menu, you can choose an existing Lambda Layer to add to your function.
![AWS Lambda Layers Folder Structure](/assets/images/2019-12-06-attach-aws-layers-to-lambda-using-aws-sam-yaml-tutorial/aws-console-add-layer-to-function-menu.png)

5. Press `Add` to return to Lambda Console and then press `Save` on the top right corner to save this action.   

## AWS SAM Lambda Entity
To add Lambda Layers to a function, you can use `Layers` property of your `AWS::Serverless::Function` resource entity.

Let's say the ARN of my layer is `arn:aws:lambda:us-east-2:1234567890:layer:AwsServices:16`. I can then add this a list item to Layers property. 

You also need provide `lambda:GetLayerVersion` permission for your Lambda function to get Lambda Layer version.  

AWS::Serverless::Function entity with a Lambda Layer.  
```yaml
UserManagementFunction:
  Type: AWS::Serverless::Function
  Properties:
    Handler: index.handler
    Runtime: python3.8
    FunctionName: 'lambda-with-layer'
    Description: 'lambda with layer'
    CodeUri: ./
    Policies:
      - Statement:
        - Effect: "Allow" 
          Action: 
            - 'lambda:GetLayerVersion' 
          Resource: 
            - 'arn:aws:lambda:*:1234567890:layer:*:*'
    Layers:
      - arn:aws:lambda:us-east-2:1234567890:layer:layer1:16
```

## CloudFormation Role Permission
To enable CloudFormation to create Lambda Layers for you, the assumed role needs to have permission to access and manipulate AWS Lambda Layers. You can attach the following inline policies to your CloudFormation role in order for it to attach Lambda Layers to your Lambda functions for you.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
          "lambda:GetLayerVersion",
          "lambda:DeleteLayerVersion",
          "lambda:ListLayerVersions",
          "lambda:ListLayers",
          "lambda:AddLayerVersionPermission",
          "lambda:RemoveLayerVersionPermission"
      ],
      "Resource": "*"
    }
  ]
}
```

{% include eof.md %}