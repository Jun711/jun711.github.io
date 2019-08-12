---
layout: single
header:
  teaser: /assets/images/teasers/amazon-s3.jpg
title: "Handle Amazon S3 Download No Access-Control-Allow-Origin Header(CORS) Error"
date: 2019-08-04 20:00:00 -0800
categories: AWS
tags:
  - Amazon S3
  - serverless
--- 
Learn how to handle Amazon S3 CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource error.

## Error Message
If the error message that shows up on DevTools console is something like the following, it means your Cross-Origin Resource Sharing(CORS) policy for your S3 bucket is not set up properly.  

Note that even when there is CORS error, you can still download from your S3 item url by pasting S3 item url on a browser's address bar.  

<pre class='code'><code>
Access to fetch at 'https://bucket-name.s3.amazonaws.com/item.extension' from 
origin 'https://www.my-page.com' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource. 
If an opaque response serves your needs, 
set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

</code></pre>

A screenshot of the error.  

![Screenshot of No 'Access-Control-Allow-Origin' Header Error](/assets/images/2019-08-04-handle-amazon-s3-no-access-control-allow-origin-header-cors-error/download-from-amazon-s3-no-access-control-allow-origin-header-error.png)

This is because when you make a cross-domain request on your webpage and it violates browsers' `same-origin policy`. 

A cross-domain request happens when you are trying to access a url that is different from your web page url. For example, your webpage url is 'https://www.my-page.com' while the url that you try to access is 'https://bucket.s3.amazonaws.com/item.extension'.  

Adopted from [MDN Same-origin Policy Document](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy){:target="view_window"}: 

> The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin. It helps isolate potentially malicious documents, reducing possible attack vectors.

## Solution
You should set up CORS for Amazon S3 bucket to be able to access your S3 item on your webpage.  

### 1. AWS Console
You can do it via AWS Console. Open up your S3 Bucket and click on `Permissions` tab and select `Bucket Policy` and your will see something like the image below.  

![Amazon S3 Bucket Policy Editor](/assets/images/2019-08-04-handle-amazon-s3-no-access-control-allow-origin-header-cors-error/amazon-s3-bucket-policy-editor.png)

You can use AWS Policy Generator to generate your policy. It can be accessed via a link at the bottom of the Bucket policy editor.  

### 2. Bucket Policy
Modify the following policy configuration to include your web page domain url and HTTP methods that are allowed to access your S3 bucket. 

```xml
<CORSConfiguration>
 <CORSRule>
   <AllowedOrigin>http://www.webpage1.com</AllowedOrigin>

   <AllowedMethod>GET</AllowedMethod>
   <AllowedMethod>POST</AllowedMethod>

   <AllowedHeader>*</AllowedHeader>
 </CORSRule>
 <CORSRule>
   <AllowedOrigin>http://www.webpage2.com</AllowedOrigin>

   <AllowedMethod>PUT</AllowedMethod>
   <AllowedMethod>POST</AllowedMethod>
   <AllowedMethod>DELETE</AllowedMethod>

   <AllowedHeader>*</AllowedHeader>
 </CORSRule>
 <CORSRule>
   <AllowedOrigin>*</AllowedOrigin>
   <AllowedMethod>GET</AllowedMethod>
 </CORSRule>
</CORSConfiguration>
```

Note that Amazon S3 it evaluates the CORS configuration for the bucket and uses the rule from first CORSRule item that matches the incoming browser preflight request(OPTIONS) to enable a cross-origin request.

If this is to enable downloading from an S3 bucket on a webpage `http://www.my-page.com`, it can be like this:

```xml
<CORSConfiguration>
 <CORSRule>
   <AllowedOrigin>http://www.my-page.com</AllowedOrigin>

   <AllowedMethod>GET</AllowedMethod>
   <AllowedMethod>POST</AllowedMethod>

   <AllowedHeader>*</AllowedHeader>
 </CORSRule>
</CORSConfiguration>
```

Read Amazon S3 CORS document if you need a more advanced configuration. 

{% include eof.md %}