---
layout: single
header:
  teaser: /assets/images/amazon-s3-simple-storage-service.jpeg
title: "How to set Amazon S3 files download names?"
date: 2019-03-04 20:00:00 -0800
categories: AWS
tags:
  - Amazon S3
  - Python
--- 
When I was downloading via an Amazon S3 url, I realized that it had the exact name as how I kept it in the storage. It would be more informative and convenient to users if the downloaded that have meaningful names instead of randomly generated IDs. 

## Download attribute
To make my downloaded S3 files have a file name, I first tried with Anchor element's download attribute.

The following is an Anchor element with a download attribute.
```
<a download="transparent.gif" href="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">Download transparent png</a>
```

You can try by downloading this transparent image by clicking <a download="transparent.gif" href="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">here</a>. I have set the file name to transparent.gif.

However, it didn't work when I used download attribute of an Anchor element to set the name of my to-be-download S3 files. This is because this download attribute only works for urls of the same-origin. Check out [MDN Achor element doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Attributes){:target="_blank"} to read more about this download attribute.

## Content-Disposition
Then, I found this Content-Disposition parameter of S3 client's put_object method.

According to [Boto3 S3 doc](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#s3.Client.put_object){:target="_blank"}, ContentDisposition is used to specify presentational information for an object.

According to [MDN Content-Disposition doc](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition){:target="_blank"}, Content-Disposition is defined as following:
> In a regular HTTP response, the Content-Disposition response header is a header indicating if the content is expected to be displayed inline in the browser, that is, as a Web page or as part of a  Web page, or as an attachment, that is downloaded and saved locally.

Thus, we can use it as an attachment that users can download and save locally if we add Content-Disposition to a file's response header. Example: 
```
Content-Disposition: attachment; filename="filename.txt"
```

### Solution in Python
#### New files
For new files added to a S3 bucket, these files can be added with ContentDisposition property.
```python
S3Client = boto3.client('S3')
obj_key = '123.mp3'
disposition = 'attachment; filename=\"' + name + '.mp3\"'

response = S3Client.put_object(
    Body=content,
    Bucket=os.environ['S3_BUCKET'],
    Key=obj_key,
    ContentDisposition=disposition,
    ...
  )
```
#### Existing files
To update existing files in an S3 bucket, the files' content disposition property can be updated by creating a new copy of the file and deleting the old copy using S3 client's copy_object and delete_object methods.
```python
S3Client = boto3.client('S3')
obj_key = '123.mp3'
disposition = 'attachment; filename=\"' + name + '.mp3\"'

response = S3Client.copy_object(
    Bucket=os.environ['S3_BUCKET'],
    Key=obj_key,
    CopySource={'Bucket': os.environ['S3_BUCKET'], 'Key': obj_key},
    ContentDisposition=disposition,
    ...
  )

response = client.delete_object(
    Bucket=os.environ['S3_BUCKET'],
    Key=obj_key
 )
```

### Possible Errror
I happened to get this *ERR_RESPONSE_HEADERS_MULTIPLE_CONTENT_DISPOSITION* error in the process of trying. It was because some of my file names contain characters such as a comma that need to wrapped by quotes and I forgot to include double quotes around the file names. 

I realized I needed to have double quotes around my file names in Content-Disposition header string. Note the escaped `\"` after filename and after `.mp3\"` in my python code above.

```python
disposition = 'attachment; filename=\"' + name + '.mp3\"'
```

With this, you can set the name of your downloaded S3 files.

{% include eof.md %}