---
layout: single
header: 
  teaser: /assets/images/teasers/angular.png
title: "Angular Tree-Shaking"
date: 2019-08-12 20:00:00 -0800
categories: Web
tags: 
  - 'Angular'
  - 'TypeScript'
  - 'JavaScript'
---
Learn about Angular tree-shaking.  

## Tree shaking
When a tree is shaked especially in autumn, dead leaves will fall off. In Angular context, tree shaking means shaking off unused code by Angular compiler `ngc`. In other words, it means removal of dead code.   

Angular compiler is capable of executing tree-shaking and excludes dead code from built bundles. Dead code is the code that is not referenced in an Angular app. Tree-shaking reduces the size of JavaScript bundles (built output).  

Note that tree shaking is a common term used in JavaScript context and thus available with other JavaScript libraries and frameworks too.  

## How to Enable Angular Tree Shaking
To enable Angular tree-shaking, use Angular compiler CLI `--prod` flag. Thus the command to build Angular app with tree-shaking included is  
```typescript
ng build --prod
```

Angular CLI Build `--prod` option description:  
![Angular CLI build options](/assets/images/2019-08-12-angular-tree-shaking/angular-cli-build-prod-option.png)

{% include eof.md %}