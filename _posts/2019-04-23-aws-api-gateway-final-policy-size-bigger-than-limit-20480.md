---
layout: single
header:
  teaser: /assets/images/aws-api-gateway-logo-2018-11-11.png
title: "How to deal with AWS API Gateway Final Policy Size Bigger Than Limit(20480) error?"
date: 2019-04-23 20:00:00 -0800
categories: AWS
tags:
  - AWS API Gateway
  - AWS Lambda
  - AWS Boto 3
---

## Overview:
Learn how to deal with AWS API Gateway "Final policy size bigger than limit(20480)" error. 

## Issue
API Gateway endpoint can't invoke lambda with 5XX permission error.

When testing on API Gateway console, you see this error message:
```
Execution log for request d237e276-656e-11e9-aaff-51e803313fb3
... truncated
Date : Sending request to https://lambda.function.url
Date : Execution failed due to configuration error: 
  Invalid permissions on Lambda function
Date : Method completed with status: 500
```
However, when you try to add permission using AWS SAM yaml file or manually on console, you get "Final policy size bigger than limit(20480)" error on Cloud Formation

![AWS Cloud Formation fails to create lambda resource-based policy permission](/assets/images/2019-04-23-aws-api-gateway-final-policy-size-bigger-than-limit-20480/api-gateway-cloudformation-create-permission-fail-2019-04-23.png)

![AWS API Gateway fails to add resource-based policy to access lambda](/assets/images/2019-04-23-aws-api-gateway-final-policy-size-bigger-than-limit-20480/api-gateway-invoke-lambda-permission-final-policy-size-bigger-than-the-limit-2019-04-23.png)

## Expected Behavior
We expect to be able to provide API Gateway permissions to invoke AWS Lambda functions using a yaml file or manually on console.

## Reason 
The reason is that there are duplicate [resource-based policies](https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html){:target="_blank"} attached to your lambda function(s). 

Resource-based policies are policies attached with your lambda function(s) to allow other AWS service or other accounts to use your lambda function(s).

## Solution
Thus, you have to detach these extra policies. You can delete your lambda function(s) and republish them if you are at the beginning stage of development. However, if your lambda function(s) is already in production, that is not recommended as it will probably affect the availability of your service.  

Instead, you can use AWS lambda API to clean up policies of your lambda function(s).

I would like to share with you how to use Boto 3 - AWS SDK for Python to fix this issue.  

filter_policies function is used to filter for sids of duplicate resource-based policies.   
Then, clean_up_policies function is used to clean up those duplicate policies. 

You can save python code below as `clean-policies.py`.   
Run it using `python3 ./path/to/clean-policies.py` or  
change your directory to where the saved python is then run it using this command: `python3 ./clean-policies.py`. 

```python
import boto3
import json

# filter for sids of duplicate policies
def filter_policies(fn_name):
  client = boto3.client('lambda') 
  policy = client.get_policy(FunctionName=fn_name)['Policy']
  statements = json.loads(policy)['Statement'] 
  unique_policies = []
  duplicate_sids = []
  for item in statements:
    arn = item['Condition']['ArnLike']['AWS:SourceArn']
    if (arn not in unique_policies):
      unique_policies.append(arn)
    else:
      duplicate_sids.append(statement['Sid'])
  
  return unique_policies, duplicate_sids

# remove duplicate policies
def clean_up_policies(sids, fn_name):
  client = boto3.client('lambda')

  for sid in sids:       
    # print('remove SID {}'.format(sid))
    client.remove_permission(
      FunctionName=fn_name, 
      StatementId=sid
    )

if __name__ == '__main__':
  # insert your function names in the following list
  fn_names = ['fn1', 'fn2', 'fn3']

  for fn_name in fn_names:
    uniq_policies, sids = filter_policies(fn_name)
    # print('{} unique policies'.format(len(uniq_policies)))
    # print(uniq_policies)
    # print('{} duplicate policies'.format(len(sids)))
    # print(duplicate_sid)
    clean_up_policies(sids, fn_name)
```

You can also use other SDKs or write a shell script using AWS Lambda CLI [get-policy](https://docs.aws.amazon.com/cli/latest/reference/lambda/get-policy.html){:target="_blank"} and [remove-permission](https://docs.aws.amazon.com/cli/latest/reference/lambda/remove-permission.html){:target="_blank"} to clean up the duplicate policies attached to your lambda function(s).

{% include eof.md %}
