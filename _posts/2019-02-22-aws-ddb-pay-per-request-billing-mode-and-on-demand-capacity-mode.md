---
layout: single
header:
  teaser: /assets/images/amazon-dynamodb-wiki-screenshot-2019-02-12.png
title: "AWS DynamoDB Pay-Per-Request Billing Mode And On-Demand Read / Write Capacity Mode Configuration"
date: 2019-02-22 20:00:00 -0800
categories: AWS
tags:
  - Amazon DynamoDB
  - serverless
---
Learn how to configure AWS DynamoDB(DDB) to use pay-per-request billing mode and on-demand read/write capacity mode.  

## Why On-Demand Read/Write Capacity Mode

### Before On-Demand Capacity Mode
Before on-demand capacity mode was introduced, you had to specify provisioned read/write capacity units and the minimum value was 1 unit. However, there are times where usage is less than 1 unit but you are still charged for the provisioned capacity if you are not eligible for free tier. This can happen especially in the process of development and with tables that are used occassionally or unpredictable workloads.   

Updated as of 2019 Sep 1st, the following screenshot shows the default capacity mode configuration when a DDB table is created. A DDB table default configuration is to have 5 read and 5 write capacity units. The estimated cost per month for a table is $2.91 for US East region.

![AWS DyanamoDB Table Default Read/Write Capacity Mode](/assets/images/2019-02-22-aws-dynamodb-pay-per-request-billing-mode-and-on-demand-capacity-mode/aws-dynamodb-default-provisioned-read-write-capacity-mode.png)

### With On-Demand Capacity Mode
With on-demand capacity mode, AWS charges you based on the amount of requests you use with your DDB tables. 

Updated as of 2019 Sep 1st, the following screenshot shows the price for AWS DDB on-demand read & write requests and data storage price for US East region. It is $1.25 per million write request units and $0.25 per million read request units. Data storage is free for the first 25 GB and $0.25 per GB-month thereafter.  

![AWS DyanamoDB Table On-Demand Read & Write and Data Storage Price](/assets/images/2019-02-22-aws-dynamodb-pay-per-request-billing-mode-and-on-demand-capacity-mode/aws-dynamodb-on-demand-read-write-request-and-data-storage-price.png)

According to AWS DynamoDB documentation, DDB hardware and software are able to scale up and down to accomodate and respond to your DDB tables workloads.   

Quote from [AWS DynamoDB Pricing page](https://aws.amazon.com/dynamodb/pricing/){:target="_blank"}. Check out DDB pricing page for more detailed information.    

> With on-demand capacity mode, DynamoDB charges you for the data reads and writes your application performs on your tables. You do not need to specify how much read and write throughput you expect your application to perform because DynamoDB instantly accommodates your workloads as they ramp up or down.

After you configure your DDB table to use on-demand read/write capacity mode, your billing-mode for that particular DDB table would be pay-per-request. 

## What's in AWS DynamoDB Free Tier Benefits
AWS provides a free tier to let users get free, hands-on experience with AWS services. As of 2019 Sep 1st, the following items are included in AWS DynamoDB Free Tier monthly benefits on a per-region, per-payer account basis.  

<pre class='code'>
<code>
1) 25 WCUs and 25 RCUs of provisioned capacity
2) 25 GB of data storage
3) 25 rWCUs for global tables deployed in two AWS Regions
4) 2.5 million stream read requests from DynamoDB Streams
5) 1 GB of data transfer out (15 GB for your first 12 months),   
aggregated across AWS services

</code></pre>  

- WCU is write capacity unit.   
- RCU is read capacity unit.  
- rWCU is replicated write capacity unit.   

## Configure For On-Demand Capacity Mode
There are multiple ways to configure your AWS DDB tables to use pay-per-request billing mode and on-demand capacity mode.

### AWS Console
You can do it on AWS DynamoDB console.  

1. Go to AWS Console and open up your DynamoDB table.  
2. Open `Capacity` Tab and look for `Read/write capacity mode`.  
3. Change Provisioned to `On-demand` if it is not already so.  
4. Wait for a couple minutes for on-demand configuration to take effect.  

![AWS DyanamoDB Table Capacity Tab](/assets/images/2019-02-22-aws-dynamodb-pay-per-request-billing-mode-and-on-demand-capacity-mode/aws-dynamodb-on-demand-read-write-capacity-mode.png)

### AWS CLI
You can set a DDB table to use on-demand read/write capacity mode and pay-per-request billing mode when it is created. You can also modify existing DDB tables.  

When you create a new table using create-table command, you can specify its `billing-mode` attribute as `PAY_PER_REQUEST`.   

**create-table command**  
<pre class='code'>
<code>
aws dynamodb create-table \
  --table-name My-Table \
  --attribute-definitions '[
    {
      "AttributeName": "Id",
      "AttributeType": "S"
    },
  ]' \
  --key-schema '[
    {
      "AttributeName": "Id",
      "KeyType": "HASH"
    },
  ]' \
  --billing-mode: "PAY_PER_REQUEST"  

</code></pre>

With existing tables, you can update them using update-table command and specify its `billing-mode` attribute as `PAY_PER_REQUEST`.  

**update-table command**  
<pre class='code'>
<code>
$ aws dynamodb update-table \
  --table-name My-Table \
  --billing-mode: "PAY_PER_REQUEST"  
  
</code></pre>

### AWS CloudFormation in Yaml
You can also configure your DDB tables to use pay-per-request billing mode using AWS CloudFormation `AWS::DynamoDB::Table` resource type declaration.

```yaml
CommUserTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      -
        AttributeName: "id"
        AttributeType: "S"
    KeySchema:
      -
        AttributeName: "id"
        KeyType: "HASH"
    BillingMode: "PAY_PER_REQUEST"
```

{% include eof.md %}