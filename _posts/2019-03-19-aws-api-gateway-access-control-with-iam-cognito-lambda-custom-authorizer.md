---
layout: single
header:
  teaser: /assets/images/aws-api-gateway-logo-2018-11-11.png
title: "AWS Api Gateway Authorization(Access Control) with IAM, Cognito or Lambda Authorizer"
date: 2019-03-19 20:00:00 -0800
categories: AWS
tags:
  - AWS Serverless Application Model(AWS SAM)
  - AWS CloudFormation
  - AWS API Gateway
  - AWS Cognito
  - AWS IAM
---
## Overview:
Learn how to set up control access to your AWS API Gateway with IAM permissions, Amazon Cognito User Pools or Lambda Authorizer (previously named Custom Authorizer). 

## Amazon Cognito User Pools
### AWS API Gateway Console
1. On Api Gateway console left panel, choose your API and select 'Authorizers'.  
![AWS API Gateway Authorizer](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-authorizers-item-2019-03-19.png)

2. On Authorizers menu, select 'Create New Authorizer'. 
![AWS API Gateway Authorizer](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-create-new-cognito-authorizer-2019-03-19.png)

3. Select 'Cognito' and fill up the form with the right information. For Token Source, you use 'Authorization' header with default configuration. Save the changes to create a new Cognito Authorizer.  
![AWS API Gateway Cognito Authorizer](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-cognito-authorizer-2019-03-19.png)

4. Select 'Resources' on the left panel. Select the resource and method that you want to secure.
![AWS API Gateway API Method Request](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gatway-console-api-resources-method-request-2019-03-19.png)

5. On Method Request menu, in settings section, click pencil icon on the right of Authorization item to open up Authorization option menu.
![AWS API Gateway Authorization](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-choose-authorization-2019-03-19.png)

6. Choose Cognito Authorizer that you created in step 3. Remember to click the check icon appears to the right to save the configuration. There may be a prompt alert that asks for permission.   
![AWS API Gateway Cognito Authorization](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-cognito-authorization-2019-03-19.png)

7. When control access is configured and saved, you should deploy your API for it to take effect. Choose the stage that you want to deploy your API to and your API endpoint will be ready to be used.  
![AWS API Gateway Deploy API](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-deploy-api-2019-03-19.png)

### AWS SAM / Swagger with AWS CloudFormation
#### AWS SAM API Auth Object
You can use [AWS SAM API Auth Object](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object){:target="_blank"} to configure your yaml file to use Cognito Authorizer based on the following example. 
```yaml
MyApi:
  Type: AWS::Serverless::Api
  Properties:
    StageName: Prod
    Auth:
      DefaultAuthorizer: MyCognitoAuth
      Authorizers:
        MyCognitoAuth:
          # Can also accept an array
          UserPoolArn: !GetAtt MyCognitoUserPool.Arn 
          Identity: # OPTIONAL
            # OPTIONAL; Default: 'Authorization'
            Header: MyAuthorizationHeader 
            # OPTIONAL
            ValidationExpression: myAuthValidationExp
```            

#### OpenAPI's Swagger
You can use [OpenAPI's Swagger object's Security Definitions object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#security-definitions-object){:target="_blank"}. CloudFormation supports Swagger for API Gateway configuration.
```yaml
securityDefinitions:
  CognitoAuthorizer:
    type: "apiKey"
    name: "Authorization"
    in: "header"
    x-amazon-apigateway-authtype: "cognito_user_pools"
    x-amazon-apigateway-authorizer:
      providerARNs: 
      # you can also use !GetAtt MyCognitoUserPool.Arn
      - "arn:aws:cognito-idp:region:accNum:userpool/poolId"
      type: "cognito_user_pools"
```

Include the above Cognito Authorizer security definition under Definition Body of your AWS::Serverless::API object.  
Then, add a security item that points to the securityDefinition under your API path method.
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
      securityDefinitions: # 1 Add security definition
        CognitoAuthorizer:
          type: "apiKey"
          name: "Authorization"
          in: "header"
          x-amazon-apigateway-authtype: "cognito_user_pools"
          x-amazon-apigateway-authorizer:
            providerARNs: 
            - # userPool ARN
            type: "cognito_user_pools"
      paths:
        /myMethod:
          post:
            produces:
            - "application/json"
            responses:
              "200":
                description: "200 response"
                headers:
                  Access-Control-Allow-Origin:
                    type: "string"
                  Access-Control-Allow-Methods:
                    type: "string"
                  Access-Control-Allow-Headers:
                    type: "string"
            security: # 2 Add security item
              - CognitoAuthorizer: []
            x-amazon-apigateway-integration:
              uri: # api-gateway-arn
              responses: {}
              httpMethod: "POST"
              type: "aws_proxy"
```
For x-amazon-apigateway-integration uri, you can refer to this [AWS SAM example on GitHub](https://github.com/eugenp/tutorials/blob/master/aws-lambda/sam-templates/template-inline-swagger.yaml){:target="_blank"}.

## IAM permissions
### AWS API Gateway Console
1. On Api Gateway console left panel, choose your API and select 'Resources'.  
![AWS API Gateway Authorizer](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-resources-item-2019-03-19.png)

2. Select 'Resources' on the left panel. Select the resource and method that you want to secure.
![AWS API Gateway API Method Request](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gatway-console-api-resources-method-request-2019-03-19.png)

3. On Method Request menu, in settings section, click pencil icon on the right of Authorization item to open up Authorization option menu. 
![AWS API Gateway Authorization](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-choose-authorization-2019-03-19.png)

4. Choose AWS_IAM for authorization. Remember to click the check icon appears to the right to save the configuration. There may be a prompt alert that asks for permission.
![AWS API Gateway AWS IAM Authorization](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-aws-iam-authorization-2019-03-19.png)

5. When control access is configured and saved, you should deploy your API for it to take effect. Choose the stage that you want to deploy your API to and your API endpoint will be ready to be used.  
![AWS API Gateway Deploy API](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-deploy-api-2019-03-19.png)

### AWS SAM / Swagger with AWS CloudFormation
#### AWS SAM API Auth Object
With AWS SAM v1.10.0, authorization via AWS IAM is not supported yet. Earlier in January 2019, there was [RFC: API Gateway IAM (AWS_IAM) Authorizers](https://github.com/awslabs/serverless-application-model/issues/781){:target="_blank"}.  
Thanks to Takahiro Horike that completed a [pull request for adding AWS IAM authorizer](https://github.com/awslabs/serverless-application-model/pull/827){:target="_blank"}. When it is released, you will be able to use it like this based on the [pull request document](https://github.com/horike37/serverless-application-model/blob/c281b55c65944ce7f3cbfd6366d14e58e8fafa7e/versions/2016-10-31.md#api-auth-object){:target="_blank"}.
```yaml
MyApi:
  Type: AWS::Serverless::Api
  Properties:
    StageName: Prod
    Auth:
      DefaultAuthorizer: AWS_IAM
```       

#### OpenAPI's Swagger
You can use [OpenAPI's Swagger object's Security Definitions object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#security-definitions-object){:target="_blank"}. CloudFormation supports Swagger for API Gateway configuration.
```yaml
securityDefinitions:
  AwsIamAuthorizer:
    type: "apiKey"
    name: "Authorization"
    in: "header"
    x-amazon-apigateway-authtype: "awsSigv4"
```
Include the above AWS IAM Authorizer security definition under Definition Body of your AWS::Serverless::API object.  
Then, add a security item that points to the securityDefinition under your API path method.
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
      securityDefinitions: # 1 Add security definition
        AwsIamAuthorizer:
          type: "apiKey"
          name: "Authorization"
          in: "header"
          x-amazon-apigateway-authtype: "awsSigv4"
      paths:
        /myMethod:
          post:
            produces:
            - "application/json"
            responses:
              "200":
                description: "200 response"
                headers:
                  Access-Control-Allow-Origin:
                    type: "string"
                  Access-Control-Allow-Methods:
                    type: "string"
                  Access-Control-Allow-Headers:
                    type: "string"
            security: # 2 Add security item
              - AwsIamAuthorizer: []
            x-amazon-apigateway-integration:
              uri: # api-gateway-arn
              responses: {}
              httpMethod: "POST"
              type: "aws_proxy"
```
For x-amazon-apigateway-integration uri, you can refer to this [AWS SAM example on GitHub](https://github.com/eugenp/tutorials/blob/master/aws-lambda/sam-templates/template-inline-swagger.yaml){:target="_blank"}.

## Custom Authorizer
### AWS API Gateway Console
1. On Api Gateway console left panel, choose your API and select 'Authorizers'.  
![AWS API Gateway Authorizer](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-authorizers-item-2019-03-19.png)

2. On Authorizers menu, select 'Create New Authorizer'. 
![AWS API Gateway Authorizer](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-create-new-lambda-authorizer-2019-03-19.png)

3. Select 'Lambda' and fill up the form with the intended configuration.  
Choose your lambda authorizer function.  
For Lambda Invoke Role, you can check out AWS Security Token Service.  
For Token Source, you use 'Authorization' header with default configuration.  
Save the changes to create a new Lambda Authorizer.   
![AWS API Gateway Lambda Authorizer](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-lambda-custom-authorizer-2019-03-19.png)

4. Select 'Resources' on the left panel. Select the resource and method that you want to secure.
![AWS API Gateway API Method Request](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gatway-console-api-resources-method-request-2019-03-19.png)

5. On Method Request menu, in settings section, click pencil icon on the right of Authorization item to open up Authorization option menu.
![AWS API Gateway Authorization](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-choose-authorization-2019-03-19.png)

6. Choose Lambda Authorizer that you created in step 3. Remember to click the check icon appears to the right to save the configuration. There may be a prompt alert that asks for permission.
![AWS API Gateway Authorization](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-lambda-authorization-2019-03-19.png)

7. When control access is configured and saved, you should deploy your API for it to take effect. Choose the stage that you want to deploy your API to and your API endpoint will be ready to be used.  
![AWS API Gateway Deploy API](/assets/images/2019-03-19-aws-api-gateway-access-control-with-iam-cognito-lambda-custom-authorizer/aws-api-gateway-console-deploy-api-2019-03-19.png)

### AWS SAM / Swagger with AWS CloudFormation
#### AWS SAM API Auth Object
You can use [AWS SAM API Auth Object](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object){:target="_blank"} to configure your yaml file to use Lambda Authorizer based on the following example. MyAuthFunction refers to your Lambda Authorizer function.  
```yaml
MyLambdaRequestAuth:
  FunctionPayloadType: REQUEST
  FunctionArn: !GetAtt MyAuthFunction.Arn
  FunctionInvokeRole: # OPTIONAL
  Identity:
    # Must specify at least one of Headers, 
    # QueryStrings, StageVariables, or Context
    Headers: # OPTIONAL
      - Authorization1
    QueryStrings: # OPTIONAL
      - Authorization2
    StageVariables: # OPTIONAL
      - Authorization3
    Context: # OPTIONAL
      - Authorization4
    ReauthorizeEvery: 0 # OPTIONAL; Service Default: 300
```
  
Another example:
```yaml
MyApi:
  Type: AWS::Serverless::Api
  Properties:
    StageName: Prod
    Auth:
      DefaultAuthorizer: MyLambdaRequestAuthorizer
      Authorizers:
        MyLambdaRequestAuthorizer:
          FunctionPayloadType: REQUEST
          FunctionArn: !GetAtt MyAuthFunction.Arn
          # FunctionInvokeRole: !Ref MyRole
          Identity:
            QueryStrings:
              - auth
            # NOTE: Additional options:
            # Headers:
            #   - Authorization
            # StageVariables:
            #   - AUTHORIZATION
            # Context:
            #   - authorization
            # ReauthorizeEvery: 100 # seconds
```
You can refer this [AWS SAM github example](https://github.com/awslabs/serverless-application-model/blob/master/examples/2016-10-31/api_lambda_request_auth/template.yaml
){:target="_blank"} for more information.  

#### OpenAPI's Swagger
You can use [OpenAPI's Swagger object's Security Definitions object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#security-definitions-object){:target="_blank"}. CloudFormation supports Swagger for API Gateway configuration.
```yaml
securityDefinitions:
  LambdaAuthorizer:
    type: "apiKey"
    name : "Authorization"
    in: "header"
    x-amazon-apigateway-authtype: "oauth2"
    x-amazon-apigateway-authorizer:
      authorizerUri:
      - # ARN of Lambda Authorizer
      type: "token"
      authorizerCredentials: "arn:aws:iam::account-id:role"
      identityValidationExpression: "^x-[a-z]+"
      authorizerResultTtlInSeconds: 60
```
Your authorizerUri is the ARN of your Lambda function. It is in this format:
`arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:account-id:function:function-name/invocations`.

Include the above Lambda Authorizer security definition under Definition Body of your AWS::Serverless::API object.  
Then, add a security item that points to the securityDefinition under your API path method.
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
      securityDefinitions: # 1 Add security definition
        LambdaAuthorizer:
          type: "apiKey"
          name : "Authorization"
          in: "header"
          x-amazon-apigateway-authtype: "oauth2"
          x-amazon-apigateway-authorizer:
            authorizerUri:
            - # ARN of Lambda Authorizer
            type: "token"
            authorizerCredentials: "arn:aws:iam::account-id:role"
            identityValidationExpression: "^x-[a-z]+"
            authorizerResultTtlInSeconds: 60
      paths:
        /myMethod:
          post:
            produces:
            - "application/json"
            responses:
              "200":
                description: "200 response"
                headers:
                  Access-Control-Allow-Origin:
                    type: "string"
                  Access-Control-Allow-Methods:
                    type: "string"
                  Access-Control-Allow-Headers:
                    type: "string"
            security: # 2 Add security item
              - LambdaAuthorizer: []
            x-amazon-apigateway-integration:
              uri: # api-gateway-arn
              responses: {}
              httpMethod: "POST"
              type: "aws_proxy"
```
For x-amazon-apigateway-integration uri, you can refer to this [AWS SAM example on GitHub](https://github.com/eugenp/tutorials/blob/master/aws-lambda/sam-templates/template-inline-swagger.yaml){:target="_blank"}.

## Summary
In summary, it is important to secure your AWS API Gateway endpoints to prevent them to be misused by third parties which will incur unnecessary cost to you. With this, hopefully, you can set up authorization or control access to your AWS API Gateway endpoints.

{% include eof.md %}