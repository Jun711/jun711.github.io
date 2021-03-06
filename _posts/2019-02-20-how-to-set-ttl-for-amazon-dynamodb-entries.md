---
layout: single
header:
  teaser: /assets/images/amazon-dynamodb-wiki-screenshot-2019-02-12.png
title: "How To Set Time-To-Live(TTL) Attribute For Amazon DynamoDB entries?"
date: 2019-02-20 20:00:00 -0800
categories: AWS
tags:
  - Amazon DynamoDB
  - Python
  - serverless
---
Learn how to make Amazon DynamoDB(DDB) tables clean up itself.

You can make Amazon DynamoDB table entries expire automatically by setting a time-to-live timestamp attribute. This timestamp is in [Unix Epoch time](https://en.wikipedia.org/wiki/Unix_time){:target="_blank"} format which is number of seconds that have elapsed since 1 January 1970 00:00:00. Your DDB entries will be scheduled to be deleted if current Unix Epoch time is greater than its time-to-live value.

In case you wonder what epoch means, the [definition of Epoch on Google Dictionary](https://www.google.com/search?site=async/dictw&q=Dictionary#dobs=epoch){:target="_blank"} is `a period of time in history or a person's life, typically one marked by notable events or particular characteristics.` 

## Possible use cases 
1. Keep only relatively new data for debugging or analytics.
2. Expire users' periodic usage data so that usage quota can be reset at a specific time.
3. Keep data temporary for pattern searching and usage tracking.

## Setup
You need to configure your DDB tables to set up time-to-live attribute using AWS CLI or AWS DynamoDB Console.

### 1 AWS CLI 
You can use AWS DynamoDB CLI [update-time-to-live command](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/update-time-to-live.html#){:target="_blank"}. The following is the command synopsis.

```
update-time-to-live
--table-name <value>
--time-to-live-specification <value>
[--cli-input-json <value>]
[--generate-cli-skeleton <value>]
```
#### Example
```
aws dynamodb update-time-to-live
--table-name demoTable
--time-to-live-specification Enabled=true,AttributeName=ttl
```

### 2 AWS DynamoDB Console
1. Open up your AWS console and navigate to DynamoDB.

2. Select a table that you want to set up time-to-live.

3. In the table details, there is a 'Time to live attribute' item. Click Manage TTL button next to it.

![AWS DyanamoDB Table Details Screenshot](/assets/images/aws-ddb-table-details-time-to-live-attribute-2019-02-12.png)

{:start="4"}
4. The following modal will show up, you can write your attribute name in the TTL attribute input. 
![AWS DyanamoDB Enable TTL](/assets/images/aws-ddb-enable-ttl-2019-02-12.png)

## Python Code to set ttl
You can refer to [AWS Boto3 DynamoDB document](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html){:target="_blank"} for AWS DynamoDB APIs

### Write to DDB
```python
import datetime
import time
import boto3

def write_to_ddb(key, data):
  dynamodbClient = boto3.client('dynamodb')
  # expires after one week  
  expiryTimestamp = int(time.time() + 24*3600*7)

  # OR
  # week = datetime.datetime.today() + \
  #  datetime.timedelta(days=7)
  # expiryTimestamp = int(time.mktime(week.timetuple()))
  try:
      dynamodbClient.put_item(
          TableName = os.environ['DEMO_TABLE'],
          Item = {
              'id': {
                  'S': key
              },
              'data': {
                  'S': data
              }
              'ttl': {
                  'N': str(expiryTimestamp) 
              }
          }
      )
      return True
  except Exception as e:
      print('Exception: ', e)
      return False
```

### Read from DDB
Be cautious that DynamoDB does not delete expired items immediately. On Aws DynamoDB update-time-to-live command document, it states that expired items are removed within **2 days or 48 hours from expiration time**. And, these supposedly expired items will still show up in read, query and scan operations.

You need to have `FilterExpression = '#t > :ttl'` to make sure the retrieved entries aren't expired.

```python
import datetime
import time
import boto3

def get_from_ddb(key):
    dynamodbClient = boto3.client('dynamodb')
    epochTimeNow = int(time.time())
    try:
        res = dynamodbClient.query(
            TableName = os.environ['DEMO_TABLE'],
            KeyConditionExpression = '#id = :id',
            FilterExpression = '#t > :ttl',
            ExpressionAttributeNames = {
                '#t': 'ttl',
                '#id': 'id'
            },
            ExpressionAttributeValues = {
                ':ttl': {
                    'N': str(epochTimeNow),
                },
                ':id': {
                    'S': key
                }
            }
        )
                
        if 'Items' in res:
            if len(res['Items']) >= 1:
                return res['Items']
        return None
    except Exception as e:
        print('Exception: ', e)
        return None
```

## Caveat
1. Note that your expiry timestamp(number of seconds since Epoch time) should be cast into Integer (no decimals).
2. The attribute type for ttl should be Number. However, the value in the argument should be a String.
```python
expiryTimestamp = int(time.time() + 24*3600*7)
ExpressionAttributeValues = {
  'ttl': {   
       'N': str(expiryTimestamp) 
  }
}
```

With this, you can have your DynamoDB tables remove irrelevant entries automatically.

## Further Reading
To learn how to verify if TTL is configured properly for your DynamoDB tables, check out [How to Verify TTL Configuration For Amazon DynamoDB Table article](https://jun711.github.io/aws/how-to-verify-if-amazon-dynamodb-ttl-is-set-correctly/){:target="view_window"}.

{% include eof.md %}