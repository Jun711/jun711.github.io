---
layout: single
header:
  teaser: /assets/images/amazon-dynamodb-wiki-screenshot-2019-02-12.png
title: "How to increment an atomic counter on Amazon DynamoDB?"
date: 2019-03-07 20:00:00 -0800
categories: AWS
tags:
  - Amazon DynamoDB
  - Python
--- 
If you use Amazon DynamoDB to keep track of usage count, you may encounter a situation where you need to increase a user's usage count when the user is actively using your service, how do you make sure you calculate the total usage correctly? How do you make sure you don't count more or less? 

## Serverless Setup
My backend setup is AWS API Gateway, Lambda and DynamoDB. Users connect to my Lambda service via API Gateway. Inside the lambda, besides serving requests, it also records how many units of the service is being used.  

However, when multiple requests from the user come in simultaneously (or in a high frequency), multiple Lambda instances will be spawned to handle the requests. Thus, it would result in calculation error if service record is done in these steps: 
1. Read usage data for a user from DDB
2. Add usage unit to the retrieved data
3. Write updated usage data to a DDB

Imagine the case that a user's usage record is 5 units. When 2 Lambda instances read the record and write back to ddb, they will cancel out each other's usage increase. It needs a lock to make sure that one and only one Lambda instance has access to write to ddb at a time. However, this will put other Lambda instances to wait and increase latency to the system.

## Solution
### Atomic Counter
I came to realize that the solution to this is using an [atomic counter](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.PHP.03.html#GettingStarted.PHP.03.04){:target="_blank"}.

According to Wikipedia:
> An atomic transaction is an indivisible and irreducible series of database operations such that either all occur, or nothing occurs.

Atomic counter is based on one of database ACID transaction property - atomicity. This is so that each request to update a DDB item is not interfered by other write requests. You can see a DDB atomic counter request as plus or minus operation. You can follow this example to get an idea. 

1. Usage record in DDB for user A is 5 units.
2. User A sends 3 consecutive requests: +7 units, +4 units and +10 units respectively.
3. Instead of 3 Lambda instances add usage units to 5 and write back to DDB, they should send in 3 write requests to DDB with the amount to increase.

### Boto 3 - Python
Using a dynamodb client, I can increment an atomic counter in DDB using update_item method with UpdateExpression property. A [DDB Update Expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html){:target="_blank"}'s usage is to indicate how we want to modify an item's attribute value.

This is UpdateExpression syntax summary.
```
update-expression ::=
    [ SET action [, action] ... ] 
    [ REMOVE action [, action] ...] 
    [ ADD action [, action] ... ] 
    [ DELETE action [, action] ...] 
```

#### Example code
```python
dynamodbClient = boto3.client('dynamodb', 
                    region_name='us-east-1')

res = dynamodbClient.update_item(
        TableName = os.environ['DEMO_TABLE'],
        Key = {
            'id': {
                'S': key
            }
        },
        ExpressionAttributeNames = {
            '#usage': 'usage'
        },
        ExpressionAttributeValues = {
            ':increase': {
                'N': usage,
            },
        },
        UpdateExpression = 'SET #usage = #usage + :increase',
        # UpdateExpression = 'ADD #usage :increase', 
        ReturnValues = 'UPDATED_NEW'
      )
```
What the above code meas is it updates usage attribute of an item by adding usage to its current usage value.

You can read Boto 3 [update_item API](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.update_item){:target="_blank"} API document for more information. 

You can use either `SET #usage = #usage + :increase` or `ADD #usage :increase`.

With this, you can increase a counter atomically.

{% include eof.md %}