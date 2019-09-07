---
layout: single
header:
  teaser: /assets/images/amazon-dynamodb-wiki-screenshot-2019-02-12.png
title: "AWS DynamoDB Boto3 - No module named 'boto3.dynamodb.conditions.Key'"
date: 2019-09-01 20:00:00 -0800
categories: AWS
tags:
  - Amazon DynamoDB
  - Python
---
Learn how to handle `ModuleNotFoundError: No module named 'boto3.dynamodb.conditions.Key';` error.

## Solution
The whole error message looks something like this.

<pre class='code'><code>
ModuleNotFoundError: No module named 'boto3.dynamodb.conditions.Key';
'boto3.dynamodb.conditions' is not a package

</code></pre>  

This is probably due to import syntax is incorrect. You probably imported `conditions.Key` using the syntax below.   

```python
import boto3.dynamodb.conditions.Key
```

The above import syntax is incorrect. You should import a module from a package using the following syntax.

```python
# from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Key, Attr
```

{% include eof.md %}