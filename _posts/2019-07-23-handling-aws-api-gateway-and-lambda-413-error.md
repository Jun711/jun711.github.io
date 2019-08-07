---
layout: single
header:
  teaser: /assets/images/aws-api-gateway-logo-2018-11-11.png
title: "Handling AWS Lambda Payload Limit"
date: 2019-07-23 20:00:00 -0800
categories: AWS
tags:
  - AWS API Gateway
  - AWS Lambda
  - AWS Amplify
  - Amazon S3  
  - serverless
---
Learn how to work around AWS Lambda invocation(request and response) payload size limit.    

## AWS Lambda Payload Size Limit
There is a 6 MB payload size limit for synchronous invocations and a 250 KB size limit for asynchronous invocations. 

### Synchronous vs Asynchronous Invocations
`Synchronous` invocations are requests that wait for Lambda to complete execution and return a response. 

`Asynchronous` invocations queue request events via Amazon Simple Queue Service(SQS) and return a response immediately. Lambda handles retries and failed events will be sent to a dead-letter queue.   

## 413 Payload Too Large
413 Payload Too Large response status code indicates that the request or response payload is larger than the limit allowed by AWS Lambda.  

---

When request payload is larger than allowed size, you will get a 413 request entity too large error in front end. The following is a screenshot of a PUT request using AWS Amplify API class that exceeds the allowed request payload size.  

Screenshot of Amplify PUT request with oversized payload:  
![AWS Amplify Failed with 413 Http Status Error Code](/assets/images/2019-07-23-handling-aws-api-gateway-and-lambda-413-error/aws-amplify-413-error.png)

Note that currently, there is a difficulty to retrieve 413 HTTP response status code using AWS Amplify API class that is using Axios. You can check out this [GitHub thread](https://github.com/aws-amplify/amplify-js/issues/3693) for more information.

---

When trying to return a response with payload larger than allowed size in Lambda, you will get `LambdaRuntimeClientError` that contains this object below and in front-end you will get a 502 HTTP response status code.  

<pre class='code'>
<code>
{
    "errorMessage": "Exceeded maximum allowed payload size (6291556 bytes).",
    "errorType": "RequestEntityTooLarge"
}

</code></pre>  
  
CloudWatch screenshot showing RequestEntityTooLarge error and Chrome DevTools Network Headers:
![AWS Lambda RequestEntityTooLarge Exceeded maximum allowed payload size](/assets/images/2019-07-23-handling-aws-api-gateway-and-lambda-413-error/aws-lambda-413-exceed-maximum-allowed-payload-size-6291556-bytes-RequestEntityTooLarge.png)


## Possible Solutions
These are the possible solutions to work around this payload size limit.  

### Handle Request Size Limit  

1) You can upload by batch if your request payload is a list of items where each one of them doesn't exceed Lambda payload size limit. 

For example, you can calculate JSON Ascii object size in bytes using the following function:  
 
```javascript
function getJsonAsciiObjectSizeInBytes(jsonObject) {
  return JSON.stringify(jsonObject).length;
}
```  

{:start="2"}
2) Amazon S3 supports browser-based uploads using POST via AWS Signature Version 4. It simplifies uploads and reduces upload latency as users can upload directly to Amazon S3. 

The following steps are the flow of how it works:  

1. User accesses your web page and user's browser interacts with your web server.

2. Your web page contains enough information to sign requests with AWS Signature Version 4(SigV4).  

3. Content can then be uploaded directly to Amazon S3 using requests signed with SigV4. 

### Handle Response Size Limit

1) You can do download by batch if the big payload can be separated into batches. Then, front-end and back-end can communicate and do multiple requests to download the whole payload.  

2) You can save the big payload in Amazon S3 and pass payload S3 URL to front-end via Lambda response. Front-end can then downloads directly from Amazon S3.  

## Summary
I suggest learning about AWS Lambda limits and have a workaround ready if you think your use case may possibly use up to AWS Lambda allowed payload limit.  

{% include eof.md %}