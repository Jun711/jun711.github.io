---
layout: single
header:
  teaser: /assets/images/teasers/amplify.png
title: "AWS Amplify API, Blob Response Type(Binary Data) and Error Handling"
date: 2019-07-03 20:00:00 -0800
categories: AWS
tags:
  - Amazon Amplify
  - AWS API Gateway
  - TypeScript  
  - JavaScript
---
Learn how to use AWS Amplify API with Axios to query endpoints that return Blob response type but JSON error response type.  

A Blob object is a file-like object of immutable, raw data such as image, audio, zip et cetera.  

## AWS Amplify With Axios
On AWS Amplify Documentation, you can find the following example usage of its API object.  

```javascript

let apiName = 'apiName'; // replace this with your api name.
let path = '/path'; //replace this with your API path 
let config = {
    body: {}, // replace this with attributes you need
    headers: {} // OPTIONAL
}

API.post(apiName, path, config)
  .then(response => {
    // Add your code here
  })
  .catch(error => {
    console.log(error.response)
  });

```

### API Gateway URL
An AWS Api Gateway url is in this format:  

<pre class='code'><code>
https://abcde12345.execute-api.us-east-2.amazonaws.com/Prod

</code></pre>

A particular path of your endpoint will have the path name appended to the end of the above url. For example, the above API url with path`compute`looks like this:   

<pre class='code'><code>    
https://abcde12345.execute-api.us-east-2.amazonaws.com/Prod/compute

</code></pre>

### JavaScript Example  
The following is an example to get `application/zip` Blob data from server using Amplify. Specify your Blob object's mime type using `Accept` header.  

```javascript

function apiCall(data) {
  const config = {
    responseType: 'blob',
    body: {
      'data': data
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/zip'
    }
  };

  return API.post('myApi', '/compute', config)
    .then(res => {
      console.log('response: ', res);
      const url = window.URL.createObjectURL(res);
      return Promise.resolve(url);
    })
    .catch(error => {
      console.log(error.response);
      return Promise.reject();
    });
}

```

### TypeScript Example
The following is an example to request for `image/png` Blob data from server. Specify your Blob object mime type using `Accept` header.  

```typescript

private apiCall(data: Data): Promise<BlobObj> {
  const config = {
    responseType: 'blob',
    body: {
      'data': data
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'image/png'
    }
  };

  return API.post('myApi', '/compute', config)
    .then(res => {
      console.log('response: ', res);
      const url = window.URL.createObjectURL(res);
      return Promise.resolve(url);
    })
    .catch(error => {
      console.log(error.response);
      return Promise.reject();
    });
}

```

### Error Handling
If you use Amplify API which uses Axios library to get `blob` response type, your error response will be a Blob object too. Your server might return a `JSON` object when there is an error but it would be converted into a `blob` File object.  

To extract your error response, you need to use a `FileReader` object.   

[MDN FileReader documentation](https://developer.mozilla.org/en-US/docs/Web/API/FileReader){:target="view_window"} says:   

> The FileReader object lets web applications asynchronously read the contents of files (or raw data buffers) stored on the user's computer, using File or Blob objects to specify the file or data to read.   

When a FileReader object reads the error response, the error response is available via onloadend callback function's parameter. Its value can be accessed via `param.currentTarget['result']`. Refer to examples below for more information.   

You can use a FileReader object to read error response returned by your server. However, when there is 5XX error, `err.data` may not be a Blob object. Thus, there is a need to wrap `fileReader.readAsText()` in a try catch block.   

Catch clause of an Amplify API Post function:     
```javascript

.catch(err => {
  console.log(err)
  let fr = new FileReader();

  // fr.onload = function(result) {
  //   console.log('onload: ', result)
  // };
  fr.onloadend = function(e) {
    const errRes = e.currentTarget['result'];
    // if your error response is in JSON
    const error = JSON.parse(errRes);
    if (error) {
      return Promise.reject(error);
    } 
  }
  if (err && err.data) {
    try {
      fr.readAsText(err.data);
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }
});

```

A complete Amplify API request with error handling for Blob response looks like this.   

```javascript

function apiCall(data) {
  const config = {
    responseType: 'blob',
    body: {
      'data': data
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/zip'
    }
  };

  return API.post('myApi', '/compute', config)
    .then(res => {
      console.log('response: ', res);
      const url = window.URL.createObjectURL(res);
      return Promise.resolve(url);
    })
    .catch(err => {
      console.error(err)
      let fr = new FileReader();

      // fr.onload = function(result) {
      //   console.log('onload: ', result)
      // };
      fr.onloadend = function(e) {
        const errRes = e.currentTarget['result'];
        const error = JSON.parse(errRes);
        if (error) {
          return Promise.reject(error);
        } 
      }
      if (err && err.data) {
        try {
          fr.readAsText(err.data);
        } catch (err) {
          console.error(err);
          return Promise.reject(err);
        }
      }
    });
}

```
## Fetch and XHR
The reason for this not so straightforward way to handle requests for Blob data is due to the behaviour of Axios library that AWS Amplify is using.   

Instead of using AWS Amplify library API object, you can definitely use Fetch or XHR to send a request on frontend. However, AWS Amplify library streamlines [signing API requests with AWS Signature V4](https://jun711.github.io/aws/how-to-sign-api-gateway-requests-with-signature-version-4-using-aws-amplify/){:target="view_window"}. Consider the tradeoff and choose the method that works best for you.    

## Further Reading
Check out [How to Configure API Gateway to Return Binary Response article](https://jun711.github.io/aws/aws-sam-configuration-for-api-gateway-binary-response/){:target="view_window"} to learn how to configure API Gateway to return binary response.  

{% include eof.md %}
