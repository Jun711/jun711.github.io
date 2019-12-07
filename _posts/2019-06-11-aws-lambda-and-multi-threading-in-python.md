---
layout: single
header:
  teaser: /assets/images/teasers/lambda.png
title: "AWS Lambda And Multi Threading Using Python"
date: 2019-06-11 20:00:00 -0800
categories: AWS
tags:
  - AWS Lambda
  - serverless
---
An example of using Python multi-threading in AWS Lambda. 

## Why Multi Threading
Using multithreading in AWS Lambda can speed up your Lambda execution and reduce cost as Lambda charges in 100 ms unit.  

## Python ThreadPoolExecutor
Note that ThreadPoolExecutor is available with Python 3.6 and 3.7+ runtime. ThreadPoolExecutor provides a simple abstraction to using multiple threads to perform tasks concurrently.   

### Creating a ThreadPoolExecutor
You can create a ThreadPoolExecutor instance using the following syntax. You can control number of concurrent workers / threads by setting `max_workers` parameter.   

```python

thread_pool_executor = ThreadPoolExecutor(max_workers=4)

```

### Submit A Task To Worker
Workers in this thread pool executor receives a task via ThreadPoolExecutor `submit` method.  

```python

thread_pool_executor.submit(
    a_task, 
    parameters_for_task_function)

```

### Free Resources
ThreadPoolExecutor `shutdown` method with wait parameter as `True` tells ThreadPoolExecutor instance that it should free the resources it is using when pending tasks are done executing.   

```python

thread_pool_executor.shutdown(wait=True) 

```

### Context Manager
Using Context Manager(`with` statement) syntax stops the function from exiting the with block before all the tasks(Futures) are completed. When all tasks are completed, it will call ThreadPoolExecutor `shutdown` method to free the resources that it was using.  

```python

with ThreadPoolExecutor(max_workers=4) as executor:
    executor.submit(task)

```

### Future Iterator
`concurrent.futures.as_completed` returns an iterator over Future instances.   

## Example
The following is an example using `ThreadPoolExecutor` and `as_completed` in Context Manager syntax. 

```python
from concurrent.futures import \
    ThreadPoolExecutor, as_completed

# task that is performed in parallel
def task(item, index):     
    if item.frequency > 10:
        return True, index
    else:
        return False, index

# multi-threading function 
def countHighFrequencyItem(list_of_items):
    if len(list_of_items) == 0:
        return 0

    all_tasks = []

    with ThreadPoolExecutor(max_workers=4) as executor:
        for item_index in range(len(list_of_items)):
            all_tasks.append(
                executor.submit(
                    task, 
                    list_of_items[item_index], 
                    item_index)

        temp_res = list(range(len(list_of_items)))
        # process completed tasks
        for future in as_completed(all_tasks):
            tooFrequent, index = future.result()
            temp_res[index] = tooFrequent

        count = 0
        for is_frequent in temp_res:
            if is_frequent:
                count += 1

        return count
```

## Summary
You can use Python ThreadPoolExecutor to execute functions concurrently to reduce total runtime possibly at the expense of higher memory usage.  

{% include eof.md %}