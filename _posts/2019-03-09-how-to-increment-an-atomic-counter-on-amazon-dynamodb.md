---
layout: single
header:
  teaser: /assets/images/amazon-dynamodb-wiki-screenshot-2019-02-12.png
title: "How to increment an atomic counter on Amazon DynamoDB?"
date: 2019-03-09 20:00:00 -0800
categories: AWS
tags:
  - Amazon DynamoDB
  - Python
---

## Overview: 
If you use Amazon DynamoDB to keep track of some usage count, you may come to a situation where you need to increase a user's usage count but the users might be using your service consecutively, how do you know the usage data that you retrieve from DDB is the latest data? 

Not knowing about Atomic counter, I first retrieved the data from DDB and did some calculation with the usage and wrote back to DDB. However, this will error out because when the user sends in multiple requests.

## Serverless Setup
Lambda + DDB
when multiple requests come in, multiple Lambda instances will handle the requests. Thus, they can't get the updated data. It needs some kind of lock / guarantee so that all requests would be added up.

```
1
Step 3.4: Increment an Atomic Counter
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.PHP.03.html#GettingStarted.PHP.03.04
 updateExpression = 'SET #c = #c + :charsCountStr, #t = :ttl, #y = :year, #m = :month, #d = :day'
2
Ddb updateExpression
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html
```