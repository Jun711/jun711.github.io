---
layout: single
header:
  teaser: /assets/images/amazon-dynamodb-wiki-screenshot-2019-02-12.png
title: "AWS DynamoDB Global And Local Secondary Indexes Comparison"
date: 2019-02-18 20:00:00 -0800
categories: AWS
tags:
  - Amazon DynamoDB
  - Python
  - serverless
---
Learn about AWS DynamoDB(DDB) indexes and the difference between its global and local secondary indexes.  

## Why Secondary Indexes
AWS DynamoDB being a No SQL database doesn't support queries such as `SELECT` with a condition such as the following query. 

Note that when doing the following query with an SQL database, a query optimizer evaluates available indexes to see if any index can fulfill the query.  

```sql
SELECT * FROM Users
WHERE email='username@email.com';
```

It possible to do so using DynamoDB scan operation. However, scan operations access every item in a table which is slower than query operations that access items at specific indices. Imagine, you have look for a book in a library by going through possibly all the books in the library versus you know which shelf the book is at. 

Thus, there is a need for another table or data structure that are stored with different primary key and maps a subset of attributes from this base table. This other table is called a secondary index and is managed by AWS DynamoDB. When items are added, modified, or deleted in the base table, associated secondary indexes will be updated to reflect the changes.  

## Global(GSI) vs Local Secondary Indexes(LSI)
AWS DynamoDB supports two types of indexes: Global Secondary Index (GSI) and Local Secondary Index (LSI).  

`Global secondary index` is an index that have a partition key and an optional sort key that are different from base table's primary key. It is deemed "global" because queries on the index can access the data across different partitions of the base table. It can viewed as a different table that contains attributes based on the base table.  

`Local secondary index` is an index that must have the same partition key but a different sort key from the base table. It is considered "local" because every partition of a local secondary index is bounded by the same partition key value of the base table. 

## Important Difference between GSI and LSI

| Features | Global Secondary Index(GSI) | Local Secondary Index(LSI) |
|:---|---|---|
| Primary Key Schema | Simple (partition key) or composite | Must be composite(partition key and sort key) | 
| Primary Key Attributes | Partition key and sort key(optional) can be any base table attributes of type string, number or binary | Partition key must be the same as base table's partition key. Sort key can be any base table attribute of type string, number, or binary |
| Size Restrictions | No | For each partition key value, maximum size is 10 GB |
| Creation | Anytime | When DDB table is created  |
| Deletion | Anytime | When DDB table is deleted |
| Read Consistency | Eventual consistency | Eventual and strong consistency |
| Provisioned Throughput Consumption | Each index has its own provisioned throughput independent of base table | Queries, Scans and Updates consume read and write capacity units of the base table |
| Projected Attributes | Limited to attributes specified during creation | Can request attributes that aren't specified during creation as DDB will fetch them automatically with extra throughput cost |
| Count Per Table | 20 per DDB table | 5 per DDB table |
{: .three-col-table table }

Since GSIs have their own throughput consumption, to minimize cost, I suggest project only attributes that are needed. You can always create a new index that projects more attributes and replace the existing one when use case changes.  

## Which One Should I Use?
Check out the following GSI and LSI examples to get an idea of when to use which. 

### GSI Example
Consider this table that contains Uuid as primary key, UserId and Data attributes. 

<pre class='code'>
<code>
| Uuid(Partition Key) | UserId | Data | 
</code>
</pre>

With this base table key schema, it can answer queries to retrieve data for a uuid. However, to get all data for a user id, it would have to do a scan query and get all the items that have matching user id.  

To be able to get all data for a user efficiently, you can use a global secondary index that has `UserId` as its primary key (partition key). Using this index, you can do a query to retrieve all data for a user.  

### LSI Example 
Consider this table that uses composite keys: `Uuid` as partition key, `UserId` as sort key and other attributes: GroupId and Data. 

<pre class='code'>
<code>
| Uuid(Partition Key) | UserId(Sort Key) | GroupId | Data |
</code>
</pre>

With this base table key schema, it can answer queries to retrieve data for a uuid and a specific user. However, to retrieve this item for a specific group id, it would have to do a scan query and check each item for a matching group id. This can be a use case where there is a user role and a group admin role where the group admin can retrieve a user submitted item.   

To enable a group admin to retrieve an item efficiently, you can use a local secondary index that has `Uuid` as its partition key and `GroupId` as its sort key. Using this index, you can do a query to retrieve the data for the item that has a specific uuid and group id.   

<pre class='code'>
<code>
| Uuid(Partition Key) | GroupId(Sort Key) | UserId | Data |
</code>
</pre>

## Summary
In short, use DynamoDB Global Secondary Index when you need to support querying non-primary key attribute of a table.   

And, use DynamodB Local Secondary index when you need to support querying the items that can be identified using different composite keys. 

{% include eof.md %}