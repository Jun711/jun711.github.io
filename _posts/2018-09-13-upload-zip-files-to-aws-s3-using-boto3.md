---
layout: single
header:
  teaser: /assets/images/amazon-s3-simple-storage-service.jpeg
title: "Upload Zip Files to AWS S3 using Boto3 Python library"
date: 2018-09-13 20:00:00 -0800
categories: AWS
tags:
  - Amazon S3
  - Python
  - Boto3
---
Learn how to upload a zip file to AWS S3 using Boto3 Python library.

## Boto3
According to [boto3 document](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3.html#uploads){:target="view_window"}, these are the methods that are available for uploading.

<pre class='code'>
<code>
The managed upload methods are exposed in both the client and resource 
interfaces of boto3:

* S3.Client method to upload a file by name: 
S3.Client.upload_file()

* S3.Client method to upload a readable file-like object: 
S3.Client.upload_fileobj()

* S3.Bucket method to upload a file by name: 
S3.Bucket.upload_file()

* S3.Bucket method to upload a readable file-like object: 
S3.Bucket.upload_fileobj()

* S3.Object method to upload a file by name: 
S3.Object.upload_file()

* S3.Object method to upload a readable file-like object: 
S3.Object.upload_fileobj()

</code></pre>  
(The above methods and note are taken from boto3 doc, and there is a line saying that they are the same methods for different S3 classes.)

## Solution  
What I used was [s3.client.upload_file](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.upload_file){:target="view_window"}.

The method definition is

<pre class='code'>
<code>
# Upload a file to an S3 object.
upload_file(Filename, Bucket, Key, ExtraArgs=None, Callback=None, Config=None)

</code></pre>  

![AWS S3 Botto3 upload_file method document](/assets/images/2018-09-13-upload-zip-files-to-aws-s3-using-boto3/aws-s3-boto3-upload-file-doc.png)

## Example Code  

You can use the following code snippet to upload a file to s3.  

```python
import boto3
s3Resource = boto3.resource('s3')

try:
    s3Resource.meta.client.upload_file(
        '/path/to/file', 
        'bucketName', 
        'keyName')

except Exception as exp:
    print('exp: ', exp)

```

You can use ExtraArgs parameter to set ACL, metadata, content-encoding etc.  

```python
import boto3

s3Resource = boto3.resource('s3')

try:
    s3Resource.meta.client.upload_file(
        '/path/to/file',
        'bucketName',
        'keyName',
        ExtraArgs={'ACL': 'public-read'})

except Exception as exp:
    print('exp: ', exp)
```

All the valid extra arguments are listed on this [boto3 doc](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/customizations/s3.html#boto3.s3.transfer.S3Transfer.ALLOWED_UPLOAD_ARGS){:target="view_window"}. I have them listed below for easier reference.

<pre class='code'>
<code>
ALLOWED_UPLOAD_ARGS = [
'ACL', 'CacheControl', 'ContentDisposition',   
'ContentEncoding', 'ContentLanguage', 'ContentType', 'Expires', 
'GrantFullControl', 'GrantRead', 'GrantReadACP', 'GrantWriteACP', 'Metadata',
'RequestPayer', 'ServerSideEncryption', 'StorageClass','SSECustomerAlgorithm', 
'SSECustomerKey', 'SSECustomerKeyMD5', 'SSEKMSKeyId', 'WebsiteRedirectLocation'
]

</code></pre>    


If you need help with boto3, you can join their [gitter channel](https://gitter.im/boto/boto3?source=explore){:target="view_window"}.

## References   
1) [What is ExtraArgs for upload_fileobj? boto3 GitHub thread](https://github.com/boto/boto3/issues/789){:target="view_window"}  
2) Boto3 not uploading zip file to S3 python [StackOverflow thread](https://stackoverflow.com/questions/49552507/boto3-not-uploading-zip-file-to-s3-python){:target="view_window"}  
3) python: Open file from zip without temporary extracting it [StackOverflow thread](https://stackoverflow.com/questions/19371860/python-open-file-from-zip-without-temporary-extracting-it){:target="view_window"}

{% include eof.md %}



