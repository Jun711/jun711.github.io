---
layout: single
header:
  teaser: /assets/images/amazon-dynamodb-wiki-screenshot-2019-02-12.png
title: "Create Secondary Indexes For AWS DynamoDB to Prevent Scanning"
date: 2019-02-19 20:00:00 -0800
categories: AWS
tags:
  - Amazon DynamoDB
  - AWS CLI
  - AWS CloudFormation
---
Learn how to create DynamoDB(DDB) Global and Local Secondary Indexes(GSI and LSI).

## Why Secondary Indexes
AWS DynamoDB secondary indexes can be used to reduce cost and improve data access efficiency. This is because querying an index by primary key is faster than scanning the whole table to look for an item that has matching attributes.  

## Difference between GSI and LSI  
You can check out this [AWS DynamoDB GSI vs LSI article](https://jun711.github.io/aws/aws-dynamodb-global-and-local-secondary-indexes-comparison/){:target="view_window"} to read about difference between Global Secondary Index(GSI) and Local Secondary Index(LSI).  

## How to Create a Global Secondary Index
Follow the steps below to create a Global Secondary Index(GSI) using AWS console, AWS CLI or YAML via CloudFormation .  

### AWS DynamoDB Console   
You can create a GSI on AWS DynamoDB Console. Note that you can create a GSI during and after DDB table creation.

**1. Open DynamoDB Console**  
Go to AWS DynamoDB console and open up your DynamoDB table.  

![AWS DyanamoDB Table](/assets/images/2019-02-19-how-to-create-aws-dynamodb-secondary-indexes/aws-dynamodb-table.png)

**2. Create GSI**  
After clicking on `Create Index` button, you will see the following popup to configure an index.  

![AWS DyanamoDB Table Create Index Popup](/assets/images/2019-02-19-how-to-create-aws-dynamodb-secondary-indexes/aws-dynamodb-create-index.png)

An index's partition key can be of String, Binary or Number type.  

![AWS DyanamoDB Table Index Partition Key Types](/assets/images/2019-02-19-how-to-create-aws-dynamodb-secondary-indexes/aws-dynamodb-create-index-partition-key-options.png)

DynamoDB allows `All`, `Keys only` and `Include` projected options. Note that `Include` only projects a subset of attributes specified during index creation.  

![AWS DyanamoDB Table Index Projected Attributes Options](/assets/images/2019-02-19-how-to-create-aws-dynamodb-secondary-indexes/aws-dynamodb-projected-attributes-options.png)

Created GSIs will be listed on Indexes tab. Note that Indexes tab UI is not responsive, thus, to see all your index attributes, you have to expand your browser width and scroll to the right to see all the table columns.    

![AWS DyanamoDB Table Global Secondary Index(GSI)](/assets/images/2019-02-19-how-to-create-aws-dynamodb-secondary-indexes/aws-dynamodb-global-secondary-index.png)

### AWS CLI
You can create a Global Secondary Index(GSI) at the same time you create a DDB table using `create-table` command.   
You can also use AWS DynamoDB `update-table` command to create a GSI after creating a DDB table.   

You can specify multiple GSIs when you create using 'create-table' or 'update-table' command.  

Note:  
1) For Projection property, there are three types: `ALL`, `KEYS_ONLY` and `INCLUDE`.  For `INCLUDE` option, you specify the attributes to include using NonKeyAttributes key.   

```json 
"Projection": {
  "ProjectionType": "INCLUDE",
  "NonKeyAttributes": ["attribute1", "attribute2"]
}
```
You may not want to project all of your attributes as DynamoDB charges based on the amount of data indexed.  

2) For billing-mode, you can choose `PROVISIONED` or `PAY_PER_REQUEST`.  

**create-table command**  
<pre class='code'>
<code>
aws dynamodb create-table \
  --table-name User-Table \
  --attribute-definitions '[
    {
      "AttributeName": "UserId",
      "AttributeType": "S"
    },
    {
      "AttributeName": "GroupId",
      "AttributeType": "S"
    },
    {
      "AttributeName": "DateJoined",
      "AttributeType": "S"
    },
    {
      "AttributeName": "ArticleId",
      "AttributeType": "N"
    }
  ]' \
  --key-schema '[
    {
      "AttributeName": "UserId",
      "KeyType": "HASH"
    },
    {
      "AttributeName": "GroupId",
      "KeyType": "RANGE"
    }
  ]' \
  --global-secondary-indexes '[
    {
      "IndexName": "Group-Table",
      "KeySchema": [
        {
          "AttributeName": "GroupId",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "UserId",
          "KeyType": "RANGE"
        }
      ],
      "Projection": {
        "ProjectionType": "INCLUDE",
        "NonKeyAttributes": ["DateJoined", "ArticleId"]
      }
    }
  ]' \
  --billing-mode: "PAY_PER_REQUEST"  

</code></pre>

**update-table command**  
<pre class='code'>
<code>
$ aws dynamodb update-table \
  --table-name User-Table \
  --attribute-definitions '[
    {
      "AttributeName": "GroupId",
      "AttributeType": "S"
    },
    {
      "AttributeName": "UserId",
      "AttributeType": "S"
    }
  ]' \
  --global-secondary-index-updates '[
    {
      "Create": {
        "IndexName": "Group-Table",
        "KeySchema": [
          {
            "AttributeName": "GroupId",
            "KeyType": "HASH"
          },
          {
            "AttributeName": "UserId",
            "KeyType": "RANGE"
          }
        ],
        "Projection": {
          "ProjectionType": "ALL"
        },
        "ProvisionedThroughput": {
          "ReadCapacityUnits": 1,
          "WriteCapacityUnits": 1
        }
      }
    }
  ]'
</code></pre>

### YAML via CloudFormation 
You can declare a table with Global Secondary Indexes(GSI) using AWS::DynamoDB::Table resource. Note that you can specify multiple GSIs.

<pre class='code'>
<code>
MessagesDynamoDBTable:
  Type: AWS::DynamoDB::Table
  Properties:
    TableName: User-Table
    AttributeDefinitions:
      - AttributeName: UserId
        AttributeType: S
      - AttributeName: GroupId
        AttributeType: S
      - AttributeName: DateJoined
        AttributeType: S
      - AttributeName: ArticleId
        AttributeType: N
    KeySchema:
      - AttributeName: UserId
        KeyType: HASH
      - AttributeName: GroupId
        KeyType: RANGE
    GlobalSecondaryIndexes:
      - IndexName: Group-Table
        KeySchema:
          - AttributeName: GroupId
            KeyType: HASH
          - AttributeName: UserId
            KeyType: RANGE
        Projection:
          ProjectionType: KEYS_ONLY
    ProvisionedThroughput:
      ReadCapacityUnits: 1
      WriteCapacityUnits: 1

</code></pre>

## How to Create a Local Secondary Index
Check out different ways to create a Local Secondary Index(LCI) using AWS console, AWS CLI or YAML via AWS CloudFormation. Note that a LSI can only be created during DynamoDB table creation.  

### AWS DynamoDB Console   
You can create a LSI on AWS DynamoDB Console.  

**1. Open DynamoDB Console**  
Go to AWS DynamoDB console and click on `Create table` button to create a DDB table.   

![AWS DyanamoDB Table Index Partition Key Types](/assets/images/2019-02-19-how-to-create-aws-dynamodb-secondary-indexes/aws-dynamodb-create-table.png)

**2. Create Table**  
After clicking on `Create table` button, you will see the following form to create a DDB table. Fill out the form `Partition key` item before proceeding as it is needed to create a LSI.  

![AWS DyanamoDB Table Index Partition Key Types](/assets/images/2019-02-19-how-to-create-aws-dynamodb-secondary-indexes/aws-dynamodb-create-table-with-default-settings.png)

**3. Uncheck Use default settings**   
Uncheck `Use default settings` check box to enable creation of a secondary index.  

![AWS DyanamoDB Table Index Partition Key Types](/assets/images/2019-02-19-how-to-create-aws-dynamodb-secondary-indexes/aws-dynamodb-create-table-form.png)

**4. Create LSI**  
Click on `+ Add index` to open up Secondary Index Creation popup form.  

![AWS DyanamoDB Table Index Partition Key Types](/assets/images/2019-02-19-how-to-create-aws-dynamodb-secondary-indexes/aws-dynamodb-create-local-secondary-index.png)

Note that your DDB Local Secondary Index partition key name and type must be the same as the base DDB table. 

After typing in the same partition key and check `Add sort key`, you will be able to check `Create as Local Secondary Index` checkbox.  

![AWS DyanamoDB Table Index Partition Key Types](/assets/images/2019-02-19-how-to-create-aws-dynamodb-secondary-indexes/aws-dynamodb-create-LSI.png)

If you hover over the information icon next to `Create as Local Secondary Index` check item, you will see the following message.  

> An Index that shares the same partition key as the table may be created as an LSI. An LSI needs both an partition key and a sort key, and an LSI will utilize the table's provisioned capacities.

DynamoDB allows `All`, `Keys only` and `Include` projected options. Note that `Include` only projects a subset of attributes specified during creation.  

![AWS DyanamoDB Table Index Projected Attributes Options](/assets/images/2019-02-19-how-to-create-aws-dynamodb-secondary-indexes/aws-dynamodb-LSI-projected-attributes-options.png)

### AWS CLI
You can specify a Local Secondary Index(LSI) when you create your table using `create-table` command. Note that you can specify multiple LSIs.   

Note:  
1) For Projection property, there are three types: `ALL`, `KEYS_ONLY` and `INCLUDE`. For `INCLUDE` option, you specify the attributes to include using NonKeyAttributes key. 

```json 
"Projection": {
  "ProjectionType": "INCLUDE",
  "NonKeyAttributes": ["attribute1", "attribute2"]
}
```

You may not want to project all of your attributes DynamoDB charges based on the amount of data indexed.  

With LSI, DDB will fetch unspecified attributes automatically with extra throughput cost and latency.  

2) For billing-mode, you can choose `PROVISIONED` or `PAY_PER_REQUEST`.  

**create-table command**   
<pre class='code'>
<code>
$ aws dynamodb create-table \
  --table-name User-Articles-Table \
  --attribute-definitions '[
    {
      "AttributeName": "UserId",
      "AttributeType": "S"
    },
    {
      "AttributeName": "ArticleName",
      "AttributeType": "S"
    },
    {
      "AttributeName": "DateCreated",
      "AttributeType": "S"
    },
    {
      "AttributeName": "Content",
      "AttributeType": "S"
    }
  ]' \
  --key-schema '[
    {
      "AttributeName": "UserId",
      "KeyType": "HASH"
    },
    {
      "AttributeName": "ArticleName",
      "KeyType": "RANGE"
    }
  ]' \
  --local-secondary-indexes '[
    {
      "IndexName": "Users-DateArticleCreated-Table",
      "KeySchema": [
        {
          "AttributeName": "UserId",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "DateCreated",
          "KeyType": "RANGE"
        }
      ],
      "Projection": {
        "ProjectionType": "KEYS_ONLY"
      }
    }
  ]' \
  --billing-mode: "PAY_PER_REQUEST"  

</code></pre>

### YAML via CloudFormation 
You can declare a table with Local Secondary Indexes(LSI) using AWS::DynamoDB::Table resource. Note that you can specify multiple LSIs.    

<pre class='code'>
<code>
MessagesDynamoDBTable:
  Type: AWS::DynamoDB::Table
  Properties:
    TableName: User-Articles-Table
    BillingMode: PAY_PER_REQUEST
    AttributeDefinitions:
      - AttributeName: UserId
        AttributeType: S
      - AttributeName: ArticleName
        AttributeType: S
      - AttributeName: DateCreated
        AttributeType: S
      - AttributeName: Content
        AttributeType: S
    KeySchema:
      - AttributeName: UserId
        KeyType: HASH
      - AttributeName: ArticleName
        KeyType: RANGE
    LocalSecondaryIndexes:
      - IndexName: Users-DateArticleCreated-Table
        KeySchema:
          - AttributeName: UserId
            KeyType: HASH
          - AttributeName: DateCreated
            KeyType: RANGE
        Projection:
          ProjectionType: INCLUDE
          NonKeyAttributes: 
            - ArticleName
    
</code></pre>

## Note  
**1. Multiple Secondary Indexes**  
With AWS CLI and YAML, you can create multiple global and local secondary indexes via the same operation.  

**2. Projected Attributes**  
For projected attributes property, there are three options: 'ALL', 'KEYS_ONLY' and 'INCLUDE'. 

Choose `KEYS_ONLY` if you only need base table and index's partition and sort key values.  

For `INCLUDE` option, you can specify the attributes that you want to be mapped to your indexes.  

DynamoDB charges based on the amount of data indexed so you may not want to project `ALL` of your attributes.  

For Local Secondary Indexes, DDB fetches unspecified attributes automatically with extra throughput cost and latency.  

## Summary
Consider your query requirements carefully and create necessary DynamoDB secondary indexes to improve query performance and minimize costs.  

{% include eof.md %}