---
layout: single
header:
  teaser: /assets/images/teasers/aws-cloudformation.png
title: "Authorizing AWS CloudFormation Role to perform iam:CreateRole on Resources"
date: 2018-09-11 20:00:00 -0800
categories: AWS
tags:
  - AWS IAM
  - AWS CloudFormation
  - serverless
---
Learn how to enable CloudFormation to create roles for your AWS resources. 

## CodePipeline Error Message
When I added a policy statement to enable my lambda to use AWS Polly synthesize speech API, CodePipeline ExecuteChangeSet failed with a CloudFormation IAM role error. 

My Lambda function declaration in yaml:

```yaml
Type: 'AWS::Serverless::Function'
  Properties:
    Handler: helloWorld.handler
    Runtime: python3.6
    MemorySize: 128
    Description: 'helloWorld'
    FunctionName: helloWorld
    Policies:
      - Statement:
        - Effect: "Allow"
          Action: 
            - "polly:SynthesizeSpeech"
          Resource:
            - "Fn::Sub": "arn:aws:polly:${AWS::Region}: \
            ${AWS::AccountId}:lexicon/*"
```

The following is the error message I saw on CodePipeline console. Note that test was my project name and thus the message contains 'CodeStarWorker-test'.  

<pre class='code'>
<code>
CodeStarWorker-test-CloudFormation/AWSCloudFormation is not 
authorized to perform: iam:CreateRole on resource:
arn:aws:iam::AccountId:role/  
awscodestar-test-lambda-helloWorldRole-V5QUHYDCDRBA

</code></pre>

## Solution
Follow the steps below to add IAM policies to your CloudFormation role that are needed to execute role creation for other resources.   

1. Go to AWS IAM console and select Role on the left panel.  
2. Look for your project CloudFormation role by typing in your project name. Your CloudFormation role summary will look like the screenshot below.   

![Add Inline Policies for AWS CloudFormation IAM Role](/assets/images/2018-09-11-authorizing-aws-cloudformation-to-perform-iam-create-role/aws-codestar-cloudformation-iam-role-summary.png)

{:start="3"}
3. Click on `Add inline policy` button to open up policy editor and select `JSON` tab when it is opened.  

![AWS IAM Add Policies Visual Editor](/assets/images/2018-09-11-authorizing-aws-cloudformation-to-perform-iam-create-role/aws-codestar-cloudformation-create-policy-visual-editor.png)

{:start="4"}
4. Paste in the following JSON object into the input field. You may not need all, thus, you can experiment by adding `iam:CreateRole` first and add other actions when they are needed.

![AWS IAM Add Policies JSON Input](/assets/images/2018-09-11-authorizing-aws-cloudformation-to-perform-iam-create-role/aws-codestar-cloudformation-create-policy-json-input.png)
 
AWS IAM policy statement with allowed IAM actions.  

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
          "iam:GetRole",
          "iam:GetRolePolicy",
          "iam:PassRole",
          "iam:DetachRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:DeleteRole",
          "iam:CreateRole",
          "iam:AttachRolePolicy",
          "iam:PutRolePolicy"
      ],
      "Resource": "arn:aws:iam::*:role/*"
    }
  ]
}
```

{:start="5"}
5. Then, review and give the inline policies item a name to complete the addition of policies.

![Review AWS IAM Policies](/assets/images/2018-09-11-authorizing-aws-cloudformation-to-perform-iam-create-role/aws-codestar-cloudformation-review-iam-policy.png)

{:start="6"}
6. Now, necessary IAM policies have been added to your CloudFormation role. You can make some changes to your code or yaml and push to trigger rebuild.

![AWS IAM Policies added to CloudFormation role](/assets/images/2018-09-11-authorizing-aws-cloudformation-to-perform-iam-create-role/aws-codestar-cloudformation-iam-inline-policies-added.png)

## Summary
With addition of necessary IAM policies, CloudFormation will be able to  create roles successfully for your resources. If there are other similar IAM errors, you can fix by adding necessary roles by reading the error message carefully.  

{% include eof.md %}