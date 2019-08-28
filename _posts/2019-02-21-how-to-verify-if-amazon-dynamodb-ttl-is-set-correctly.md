---
layout: single
header:
  teaser: /assets/images/amazon-dynamodb-wiki-screenshot-2019-02-12.png
title: "Verify Time-To-Live(TTL) Configuration For Amazon DynamoDB Table"
date: 2019-02-21 20:00:00 -0800
categories: AWS
tags:
  - Amazon DynamoDB
  - serverless
---
Check out different ways to verify if an Amazon DynamoDB(DDB) table time-to-live(TTL) is configured correctly.  

## Verification Methods
### AWS Console
1. On AWS Console, open your DDB table Overview tab. You should see `Time to live attribute` item has a value	set. It is the attribute name that you use for TTL.  
Since I use `ttl`, thus, there is 'Time to live attribute    ttl' in the image below.  
![AWS DyanamoDB Table Overview Time to live attribute](/assets/images/2019-02-21-how-to-verify-if-amazon-dynamodb-ttl-is-set-correctly/amazon-dynamodb-table-time-to-live-attribute.png)

2. Open Items tab, and look for TTL attribute of any row.   
Note that TTL attribute value should be an `Integer` type. It shouldn't be be a decimal number(floating-point number: Float or Double type). The TTL values shown in the image below have incorrect data type and thus items are not automatically by TTL.        
![AWS DyanamoDB Table Details Screenshot](/assets/images/2019-02-21-how-to-verify-if-amazon-dynamodb-ttl-is-set-correctly/amazon-dynamodb-ttl-in-double.png)

3. When you hover your cursor on a TTL attribute, it should show an expiry datetime tooltips in UTC, Local and AWS Region timezones. If it doesn't, that mean TTL is not in effect.     
![AWS DyanamoDB Table Details Screenshot](/assets/images/2019-02-21-how-to-verify-if-amazon-dynamodb-ttl-is-set-correctly/amazon-dynamodb-ttl-should-be-in-integer.png)

### AWS CLI
You can also use AWS CLI DynamoDB `describe-time-to-live` command to check if time-to-live(TTL) attribute is enabled.   

```bash

aws dynamodb describe-time-to-live --table-name table-name

```

If the output contains `TimeToLiveStatus` as ENABLED, that means TTL has been configured properly for this DynamoDB table.      
Output:   
```json
{
    "TimeToLiveDescription": {
        "TimeToLiveStatus": "ENABLED",
        "AttributeName": "ttl"
    }
}
```
### Put Item
The most practical way is probably to create an item with TTL as 5 minutes from current time using `AWS DynamoDB Console` or `DynamoDB SDK`. After 5 minutes, check AWS DynamoDB console to see if the item is removed.    

Note that TTL is an Integer Number type and is in Unix time format.  

## Further Reading
If your DynamoDB table's TTL is not configured properly, you can check out [How to Set TTL For Amazon DynamoDB Entries article](https://jun711.github.io/aws/how-to-set-ttl-for-amazon-dynamodb-entries/){:target="view_window"} to learn TTL configuration for your DynamoDB Table.  

{% include eof.md %}