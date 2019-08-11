---
layout: single
header:
  teaser: /assets/images/teasers/amazon-s3-simple-storage-service.jpeg
title: "Download From Amazon Simple Storage Service(S3) Private Buckets Directly Using Presigned URLs"
date: 2019-08-06 20:00:00 -0800
categories: AWS
tags:
  - Amazon S3
  - Python
  - serverless
--- 
Learn how to enable downloading from Amazon S3 private buckets directly. 

## Presigned Urls
What are presigned urls?   

AWS provides a way to enable direct download from S3 buckets directly via `presigned urls`. Presigned urls are created, signed using your credentials and have a controllable expiry date.   

These presigned urls can be used on browser directly for downloading from an S3 bucket. You can also paste this presigned url on a browser address bar, use XHR, fetch API or other similar APIs to download your item from an S3 bucket.  

## AWS CLI Presigned Urls
You can use AWS CLI and your IAM user's credentials to presign your S3 item url. 

Presign command signature. 

```
presign
<S3Uri>
[--expires-in <value>]

```
Note that `--expires-in` value is number of seconds(integer) until the pre-signed URL expires. Default value is 3600 seconds.  

### Signature V2 (SigV2)
You can run the following command to generate a presigned url signed with SigV2 for your item.  

<pre class='code'><code>
aws s3 presign s3://bucket-name/path-to-item.extension --expires-in 300

</code></pre>

A SigV2 presigned url looks like this. Note that `\` means that the url is split into multiple rows but it is written in one line.  

<pre class='code'><code>
https://your-bucket-name.s3.amazonaws.com/your-item-path? \
AWSAccessKeyId=your-aws-access-key-id& \
Signature=url-signature& \
Expires=available-duration-in-seconds

</code></pre>

### Signature V4 (SigV4)
To sign using Signature V4, you can configure your AWS CLI using the following command.

<pre class='code'><code>
aws configure set default.s3.signature_version s3v4

</code></pre>

The command to generate a presigned url with SigV4 is the same as SigV2.

<pre class='code'><code>
aws s3 presign s3://bucket-name/path-to-item.extension --expires-in 300

</code></pre>

A SigV4 presigned url looks like this. Note that `\` means that the url is split into multiple rows but it is written in one line.  

<pre class='code'><code>  
https://your-bucket-name.s3.amazonaws.com/your-item-path? \
X-Amz-Algorithm=AWS4-HMAC-SHA256& \
X-Amz-Credential=credential-region-aws4_request& \
X-Amz-Date=20190805T051739Z& \
X-Amz-Expires=300& \
X-Amz-SignedHeaders=headers& \
X-Amz-Signature=url-signature

</code></pre>


## Boto3 Presigned Urls
Using Boto3 and your IAM user's credentials, you can use `generate_presigned_url` method to generate presigned urls. Refer to generate_presigned_url signature and document below (adopted from Boto3 documentation) for detailed information. 

<pre class='code'><code>
# Generate a presigned url given a client, its method, and arguments
generate_presigned_url(
  ClientMethod, 
  Params=None, 
  ExpiresIn=3600, 
  HttpMethod=None)

</code></pre>

**Parameters**
- ClientMethod (string) -- The client method to presign for
- Params (dict) -- The parameters normally passed to ClientMethod.
- ExpiresIn (int) -- The number of seconds the presigned url is valid for. By default it expires in an hour (3600 seconds)
- HttpMethod (string) -- The http method to use on the generated url. By default, the http method is whatever is used in the method's model.

**Returns**
- The presigned url


### Signature V2 (SigV2)
Note that the maximum expiry date of a presigned url signed with SigV2 is a year. Assuming a year has 365 days, then it would be 31536000 seconds. 

You can use the following code to generate a presigned url signed with SigV2 for your S3 item.

```python
import boto3

s3Client = boto3.client('s3')

presigned_url = s3Client.generate_presigned_url(
  ClientMethod = 'get_object',
  Params = {
    'Bucket': 'BUCKET_NAME',
    'Key': 'PATH/TO/YOUR/ITEM'
  },
  ExpiresIn = SECONDS_UNTIL_EXPIRE)

print('url: ', presigned_url)
```

A presigned url signed with SigV2 looks like this. Note that `\` means that the url is split into multiple rows but it is written in one line.  

<pre class='code'><code>
https://your-bucket-name.s3.amazonaws.com/your-item-path? \
AWSAccessKeyId=your-aws-access-key-id& \
Signature=url-signature& \
Expires=available-duration-in-seconds

</code></pre>

### Signature V4 (SigV4)
Note that to use Signature V4, you have to import Config from botocore.client and include this config `config=Config(signature_version='s3v4')` when you instantiate your Boto3 S3 client.  

The maximum expiry date of a presigned url signed with SigV4 is 7 days which is equivalent to 604800 seconds.  

```python
import boto3
from botocore.client import Config

s3Client = boto3.client(
            's3', 
            config=Config(signature_version='s3v4'))

presigned_url = s3Client.generate_presigned_url(
  ClientMethod = 'get_object',
  Params = { 
    'Bucket': 'BUCKET_NAME',
    'Key': 'PATH/TO/YOUR/ITEM'
  },
  ExpiresIn = 300)

print('url: ', presigned_url)
```

A presigned url signed with SigV4 looks like this. Note that `\` means that the url is split into multiple rows but it is written in one line.  

<pre class='code'><code>  
https://your-bucket-name.s3.amazonaws.com/your-item-path? \
X-Amz-Algorithm=AWS4-HMAC-SHA256& \
X-Amz-Credential=credential-region-aws4_request& \
X-Amz-Date=20190805T051739Z& \
X-Amz-Expires=300& \
X-Amz-SignedHeaders=headers& \
X-Amz-Signature=url-signature

</code></pre>

## Expired Presigned Urls
XML response with `AccessDenied` code is returned when accessing an expired presigned url.  

Response from Expired SigV2 Presigned Url:  

```xml
This XML file does not appear to have any style 
information associated with it. 
The document tree is shown below.
<Error>
<Code>AccessDenied</Code>
<Message>Request has expired</Message>
<Expires>2019-08-05T01:05:27Z</Expires>
<ServerTime>2019-08-05T01:05:36Z</ServerTime>
<RequestId>92153D137B561187</RequestId>
<HostId>
7/M0rLgNrjSuVb9jhjl+KDcM1Ujd5jip89vT
iKKMOQ1Upd3x5ikEWCGr9sMdOHsJruakL3g7gVE=
</HostId>
</Error>
```

Response from Expired SigV4 Presigned Url:  

```xml
This XML file does not appear to have any style 
information associated with it. 
The document tree is shown below.
<Error>
<Code>AccessDenied</Code>
<Message>Request has expired</Message>
<X-Amz-Expires>300</X-Amz-Expires>
<Expires>2019-08-05T01:10:39Z</Expires>
<ServerTime>2019-08-05T01:10:53Z</ServerTime>
<RequestId>4088E897ADFE166A</RequestId>
<HostId>
FkhDhbNk0kX4EbLqoff85yOd9A8YrV1NOCBPC/
lPQ+RFTV7R+XeL3t2K1VevmoRA5/M5VAntjQs=
</HostId>
</Error>
```

Note that the content in the responses above has been jumbled up.  

## Presigned Urls with Invalid Parameter Values  
XML response with `SignatureDoesNotMatch` code is returned when accessing an presigned url with wrong parameter values. For example, you get this response if you access a presigned url with modified expiry parameter value.  

Response from Invalid SigV2 Presigned Url:  

```xml
This XML file does not appear to have any style 
information associated with it. 
The document tree is shown below.
<Error>
<Code>SignatureDoesNotMatch</Code>
<Message>
The request signature we calculated does not match 
the signature you provided. 
Check your key and signing method.
</Message>
<AWSAccessKeyId>KAJUAKIAR3HZWLT3ZVN4</AWSAccessKeyId>
<StringToSign>
GET 1565227327 /bucket-name/item.extension
</StringToSign>
<SignatureProvided>
b9qRFyEk3ljlz44ZhoeMuVj7ce8=
</SignatureProvided>
<StringToSignBytes>
74 75 72 61 6c 73 6f 66 74 64 6f 77 6e 6c 6f 61 64 2d 76 6f 
69 63 65 73 2f 76 6f 69 63 65 64 6f 77 6e 6c 6f 61 64 2f 6d 
...
</StringToSignBytes>
<RequestId>7243CB35FFD87671</RequestId>
<HostId>
1yWmwc18e1vXSNEMYXLefaRFH3cnrvzFhBPbFnVMAHQLm/
Ia2aZTb9/brzur8TTIlJYlcvxvo38=
</HostId>
</Error>
```

Response from Invalid SigV4 Presigned Url:  

```xml
This XML file does not appear to have any style 
information associated with it. 
The document tree is shown below.
<Error>
<Code>SignatureDoesNotMatch</Code>
<Message>
The request signature we calculated does not match 
the signature you provided. 
Check your key and signing method.
</Message>
<AWSAccessKeyId>KAJUAKIAR3HZWLT3ZVN4</AWSAccessKeyId>
<StringToSign>
AWS4-HMAC-SHA256 20190805T001316Z 
20190805/us-west-1/s3/aws4_request 
c4b9819850251ea64698e59fdeb9d766
eef12ce1c3d2c415ea88e546cde725af
</StringToSign>
<SignatureProvided>
bbb18e02851c6657d75328ed5839907a0
cd76e5bc344570dd320faed21e87
</SignatureProvided>
<StringToSignBytes>
39 30 38 31 31 54 30 30 31 33 31 36 5a 0a 32 30 31 39 30 38 
31 31 2f 75 73 2d 65 61 73 74 2d 31 2f 73 33 2f 61 77 73 34 
...
</StringToSignBytes>
<CanonicalRequest>
GET /bucket-name/item.extension 
X-Amz-Algorithm=AWS4-HMAC-SHA256&
X-Amz-Credential=credential-region-aws4_request&
X-Amz-Date=20190805T001316Z&
X-Amz-Expires=300&
X-Amz-SignedHeaders=host host:bucket-name.s3.amazonaws.com 
host UNSIGNED-PAYLOAD
</CanonicalRequest>
<CanonicalRequestBytes>
61 63 76 6f 69 63 65 73 2f 42 72 69 74 69 73 68 2f 4e 61 74 
75 72 61 6c 53 6f 66 74 56 6f 69 63 65 5f 47 72 61 68 61 6d 
...
</CanonicalRequestBytes>
<RequestId>A5654DC4C4CCAB04</RequestId>
<HostId>
tAwnhlno9AvGKlTsekPP8LxZtqix7hZ5GjJOm
DBvP7GxjD1X0d0PbtAmAi5R9db6OshNHkrUxb0=
</HostId>
</Error>
```
Note that the content in the responses above has been jumbled up.  

## Caveats
1. The credentials that you can use to create a presigned URL include:

- `AWS Identity and Access Management (IAM)` instance profile which is valid up to 6 hours. 
- `AWS Security Token Service (STS)` which is valid up to 36 hours when signed with the credentials of an IAM user
- `IAM user` which is valid up to 1 year when using AWS Signature Version 2 or 7 days when using AWS Signature Version 4

{:start="2"}
2. Expiration of your Amazon S3 item's presigned urls is the minimum of the expiration time of the credentials you use to sign and the expiration time you specify while signing.  
Thus, the credentials that is used to presign your S3 URL affects the actual expiration time. It may cause your presigned urls expire before the specified expiration time. 

3. Note that my Lambda with 10 second timeout and 128 MB allocation timed out when I tried to generate more than 400 presigned urls. However, I didn't adjust Lambda timeout value to figure out how long it would take. If you measure and get an estimate, please share with me. Thank you.  

## Summary
To let users download from your S3 buckets, you can allow public read access. But, it is definitely safer to use presigned urls as you can control the expiry date of the urls and your S3 buckets and items can remain private.  

Check out [Download From Amazon Simple Storage Service(S3) using JavaScript](https://jun711.github.io/aws/download-from-amazon-s3-buckets-using-javascript/){:target="view_window"} to learn how to download from a presigned url using JavaScript.   

{% include eof.md %}