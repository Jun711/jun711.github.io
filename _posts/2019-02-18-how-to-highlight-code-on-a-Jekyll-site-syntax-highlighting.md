---
layout: single
title: "How to highlight code on a Jekyll site - Syntax Highlighting"
date: 2019-02-19 20:00:00 -0800
categories: How-to
tags:
  - Jekyll Syntax Highlighting
  -
---
To have code snippets highlighted so that they are more reader-friendly, we have wrap our code using the following syntax.

### 1 Jekyll Rouge Highlight Tag
You can install kramdown markdown parser and [rouge highlighter](http://rouge.jneen.net/){:target="_blank"} - Jekyll's default highlighter using the following command:
```
gem install kramdown rouge
```

After installing kramdown and rouge, you can add the following to your _config.yml file.
```yaml
markdown: kramdown
highlighter: rouge
    input: GFM
```

After that, you can now highlight your code by surrounding your code with {% raw %}{% highlight language %}{% endraw %} and {% raw %}{% endhighlight %}{% endraw %}. Replace languageCode with the code language. You can refer to this [rouge doc](https://github.com/jneen/rouge/wiki/List-of-supported-languages-and-lexers){:target="_blank"} for the list of supported languages.

#### Example:
<pre class='code'>
<code>{% raw %}
{% highlight javascript %}
function sayHello(name) {
  if (!name) {
    console.log('Hello World');
  } else {
    console.log(`Hello ${name}`);
  }  
}  
{% endhighlight %}
{% endraw %}</code>
</pre>

You can read [liquid tags doc](https://jekyllrb.com/docs/liquid/tags/){:target="_blank"} for more detailed information.

### 2 GitHub Flavored Markdown Fenced Code Blocks
We can also use [GitHub Fenced Code Blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/){:target="_blank"} syntax. This syntax seems to be less verbose and cleaner. 

#### Example:
<pre class='code'>
<code>```
function sayHello(name) {
  if (!name) {
    console.log('Hello World');
  } else {
    console.log(`Hello ${name}`);
  }
}

```</code>
</pre>

To syntax highlight for code of a specific language, you can add the language name next to the opening 3 backticks. You can refer to this [rouge doc](https://github.com/jneen/rouge/wiki/List-of-supported-languages-and-lexers){:target="_blank"} for the list of supported languages.

#### Example with language specified:
<pre class='code'>
<code>```javascript
function sayHello(name) {
  if (!name) {
    console.log('Hello World');
  } else {
    console.log(`Hello ${name}`);
  }
}
```</code>
</pre>

### Result
```javascript
function sayHello(name) {
  if (!name) {
    console.log('Hello World');
  } else {
    console.log(`Hello ${name}`);
  }
}
```

### References:
1. [GitHub Syntax Highlighting Doc](https://help.github.com/articles/using-syntax-highlighting-on-github-pages/){:target="_blank"}
2. [GitHub Creating and Highlighting Code Blocks Doc](https://help.github.com/articles/creating-and-highlighting-code-blocks/){:target="_blank"}