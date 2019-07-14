---
layout: single
header:
  teaser: /assets/images/aws-api-gateway-logo-2018-11-11.png
title: "AWS Amplify API Requests With Retries"
date: 2019-07-11 20:00:00 -0800
categories: AWS
tags:
  - AWS API Gateway
  - AWS Lambda
  - AWS Amplify
  - JavaScript
---

## Overview:
Learn how to send API requests using AWS Amplify API with retries. This function pattern also works for retrying a promise when the promise rejects.

## Solution
With recursion, you can make your API requests to retry when they fails. With JavaScript default function parameters, you can set a default number of retries. In essence, it retries a JavaScript function call that returns a promise until certain conditions are met. 

### Default Function Parameters
Default function parameters allow named parameters of a function to have a default value if no value is passed during function call.  
In the example below, `b` is the default function paramater that has value of 1. 

```javascript
function plus(a, b = 1) {
  return a + b;
}
```
## AWS Amplify API Retries
AWS Amplify is a JavaScript library for application(frontend) development with AWS as backend.

### TypeScript example
This example is using TypeScript with AWS Amplify API.
1. You can add a default function parameter, retries, so that you can minimize the modification of your existing function calls.
2. In the catch clause, retry if retry count is greater than 0 else handle error. 
3. To check if it works, purposely throw an error when api call succeeds. Check Network tab of your browser dev tools and you should see 3 same requests.

```typescript
import API from '@aws-amplify/api';

public apiCall(retries = 2): Promise<any> {
  const apiName = 'MyApi';
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    response: false
  };
  return API.get(apiName, '/get', config)
    .then(response => {
      // uncomment out this part to make
      // request fails on purpose
      // if (retries > 0) {
      //   throw new Error('Failed')
      // } 
      return response;
    })
    .catch(err => {
      // You can set other conditions here
      // for example, 
      // don't retry when encountering error 429
      if (retries == 0) {
        // handle API call errors here 
        // return Promise.reject(err);
        return Promise.resolve(false);
      } else {
        // apiCall with one less retry
        return this.apiCall(--retries);
      }
    });
});
```

### JavaScript example 
This example is using JavaScript with AWS Amplify API call with Cognito Authorization.

```javascript
import API from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';

public apiCall(retries = 2) {
  return Auth.currentSession()
    .then(session => {
      const apiName = 'MyApi';
      const config = {
        headers: {
          'Authorization': session.getIdToken().getJwtToken(),
          'Content-Type': 'application/json'
        },
        response: false
      };
      return API.post(apiName, '/post', config)
        .then(response => {
          return response;
        })
        .catch(err => {
          if (retries == 0) {
            return Promise.reject(err);
          } else {
            // apiCall with one less retry
            return this.apiCall(--retries);
          }
        });
    });
```

## JavaScript Promise Retries
JavaScript retrying promise when there is an error.

### Promise example
```javascript
// function that returns a promise
function myPromiseFunction(parameter) {
  return new Promise((resolve, reject) => {
    const rand = Math.random();

    if (rand <= 0.5) {
      resolve(true);
    } else {
      reject(false);
    }
  })
}

// retry if function rejects with retries value greater than 0 
function myRetryFunction(parameter, retries = 2) {
  return myPromiseFunction(paramter)
    .then(response => {
      return response;
    })
    .catch(err => {
      if (retries == 0) {
        // handle API call errors here 
        // return Promise.reject(err);
        return Promise.reject(err);
      } else {
        // apiCall with one less retry
        return myRetryFunction(parameter, --retries);
      }
    });
```

In addition, you can modify your promise function to include a catch clause like the following example instead of having a retry function. 
```javascript
function myPromiseFunction(parameter, retries = 2) {
  return new Promise((resolve, reject) => {
      const rand = Math.random();

      if (rand <= 0.5) {
        return resolve(true);
      } else {
        return reject(false);
      }
    })
    .catch(err => {
      if (retries == 0) {
        // handle API call errors here 
        // return Promise.reject(err);
        return Promise.reject(err);
      } else {
        // apiCall with one less retry
        return myPromiseFunction(parameter, --retries);
      }
    });
```

### Promise with async await
The following is the same example as before but with async and await syntax.

```javascript
// function that returns a promise
function myPromise(parameter) {
  return new Promise((resolve, reject) => {
    const rand = Math.random();

    if (rand <= 0.5) {
      resolve(true);
    } else {
      reject(false);
    }
  })
}

// retry if function rejects with retries value greater than 0 
async function myRetryFunction(parameter, retries = 2) {
  try {
    return await myPromise(parameter);;
  }
  catch (err) {
    if (retries == 0) {
      // handle API call errors here 
      // return Promise.reject(err);
      return Promise.reject(err);
    } else {
      // apiCall with one less retry
      return myRetryFunction(parameter, --retries);
    }
  }
```

## Summary
With this, you can make your AWS Amplify API requests and promise calls retry itself until conditions met. You can also modify the above function to have it retry with timeout. 

{% include eof.md %}

