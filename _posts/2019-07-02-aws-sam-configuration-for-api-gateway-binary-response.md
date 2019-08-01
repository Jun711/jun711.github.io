---
layout: single
header:
  teaser: /assets/images/aws-api-gateway-logo-2018-11-11.png
title: "AWS SAM Configuration for API Gateway Binary Response / Payloads"
date: 2019-07-02 20:00:00 -0800
categories: AWS
tags:
  - AWS API Gateway
  - AWS Lambda
  - AWS Serverless Application Model(AWS SAM)
  - serverless
---

## Overview:
Learn how to configure AWS SAM to enable Binary Response such as `audio/mpeg`, `application/zip`, `image/jpeg` etc from AWS Api Gateway with Lambda proxy integration. 

## Steps
In this walkthrough, I will use `application/zip` for example.

### 1. CloudFormation yaml 
To enable Api Gateway Binary Response, you can set `x-amazon-apigateway-binary-media-types` in your API's definition body.  

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
              passthroughBehavior: "when_no_match"
              httpMethod: "POST"
              contentHandling: "CONVERT_TO_TEXT"
              type: "aws_proxy"
      x-amazon-apigateway-binary-media-types:
      - "application/zip"
```

#### 1.1 AWS SAM

Even though AWS SAM provide `BinaryMediaTypes` property but as of Aug 2019, there seems to be a bug that will removes the specified binary media type when you deploy updates for your API.   

You can check out AWS SAM GitHub issues [553](https://github.com/awslabs/serverless-application-model/issues/553){:target="_view_window"} and [566](https://github.com/awslabs/serverless-application-model/issues/566){:target="_view_window"} for more information and update.  

Thus, the following two syntax causes your specified binary media type to be removed in subsequent deployments.

```yaml
Globals:
  Api:
    BinaryMediaTypes:
    - application~1zip
```

```yaml
MyApi:
  Type: AWS::Serverless::Api
  Properties:
    StageName: Prod
    BinaryMediaTypes: 
    - application~1zip
    ...
```

#### 1.2 Binary Media Type \*/\*

On the other hand, it works with a wild card binary type: `*~1*`. However, requests' body object will be base64 encoded. 

Setting Api BinaryMediaTypes as `*~1*` in yaml.  

```yaml
Globals:
  Api:
    BinaryMediaTypes:
    - *~1*
```

Note that you have use `~1` instead of `/`. APi Gateway will convert it to /.
You can check [AWS SAM 1.4.0 release log](https://github.com/awslabs/serverless-application-model/releases/tag/1.4.0){:target="_view_window"} and [AWS SAM API properties document](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi){:target="_view_window"} for more information.

When BinaryMediaTypes is \*/\*, you need to base64 decode `event['body']` to read what it  contains.  

```javascript
body = json.loads(base64.b64decode(event['body']))
```

### 2. Lambda Response
To pass binary response, you will need to base 64 encode it and make it a UTF-8 string. In the response object, you have to include `isBase64Encoded: true` and `Content-Type` header with value as your payload mime type.  

```python
# your binary data is in data variable
byte_data = base64.b64encode(data)
rst_obj['body'] = str(byte_data,'utf-8')
rst_obj['headers']['Content-Type'] = 'application/zip'
```

Response JSON object  

```json
{
  "statusCode": 200,
  "isBase64Encoded": true,
  "body": "//NgxAAd...",
  "headers": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Content-Type": "application/zip"
  }
}
```

Now, git push to deploy the changes.  

### 3. Api Gateway Binary Media Type
After deployment, to verify addition of binary media type, open Api Gateway console and choose your API. Then, select Settings and make sure it has binary media type configured.

![Api Gateway Binary Media Type](/assets/images/2019-07-02-aws-sam-configuration-for-api-gateway-binary-response/aws-api-gateway-binary-media-types.png)

### 4. Http Requests
Your http requests should include an Accept header with value as your binary media type. For example: `Accept: application/zip`.  

The following is a http request example using AWS Amplify API object.  

```typescript
apiCall() {
  const apiName = 'apiName';
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/zip'
    },
    responseType: 'blob'
  };

  return API.post(apiName, '/myApi', config)
    .then(response => {
      return response;
    })
    .catch(err => {
      console.error('err: ', err);
    });
  });
}
```

### 5. Download Binary
To confirm whether your API returns binary response, it looks like this on Chrome DevTools.  

![Api Gateway Binary Media Type](/assets/images/2019-07-02-aws-sam-configuration-for-api-gateway-binary-response/aws-api-gateway-binary-response-and-save-as.png)

To download your binary data, you can use browser built-in method `saveAs`.

```javascript
this.apiCall()
  .then(res => {
    saveAs(res, 'myFiles.zip');
  });
```

## Conclusion
Setting `x-amazon-apigateway-binary-media-types` property or SAM `BinaryMediaTypes` enables binary response from API Gateway.  

{% include eof.md %}

