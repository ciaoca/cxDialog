# cxDialog

cxDialog 是基于 jQuery 的对话框插件，支持自定义外观样式，同时兼容 Zepto，方便在移动端使用。

**版本：**
* jQuery v1.9+ || Zepto 1.1+
* cxDialog v1.3.0

Demo: https://ciaoca.github.io/cxDialog/

## 使用方法

### 载入 CSS 文件

```html
<link rel="stylesheet" href="jquery.cxdialog.css">
```

### 载入 JavaScript 文件

```html
<script src="jquery.js"></script>
<script src="jquery.cxdialog.js"></script>
```

### 调用 cxDialog

```javascript
$.cxDialog('内容');

$.cxDialog('内容', function(){
  // click ok callback
}, function(){
  // click no callback
});

$.cxDialog({
  title: '标题',
  info: '内容',
  ok: function(){
    // code
  },
  no: function(){}
});
```

### 设置全局默认值

``` javascript
$.cxDialog.defaults.title = '提示';
```

## 参数说明
名称|默认值|说明
---|---|---
title|''|标题
info|''|内容，可设置为文本内容，或 DOM 元素
ok|null|确认按钮回调函数
okText|'确 定'|确认按钮文字
no|null|取消按钮回调函数
noText|'取 消'|取消按钮文字
buttons|[]|自定义按钮
baseClass|''|增加自定义 class，不会覆盖默认的 class
maskClose|true|背景遮罩是否可以关闭对话框

## buttons 参数

名称|说明
---|---
text|按钮文字
callback|回调函数

### API 接口性

名称|说明
---|---
$.cxDialog.close()|关闭对话框
