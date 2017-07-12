# cxDialog

cxDialog 是基于 jQuery 的对话框插件，支持自定义外观样式，同时兼容 Zepto，方便在移动端使用。

**版本：**
* jQuery v1.7+ || Zepto 1.0+
* cxDialog v1.2.4

\* 兼容 Zepto，需要 [data 模块](https://github.com/madrobby/zepto/blob/master/src/data.js)支持

文档：http://code.ciaoca.com/jquery/cxDialog/

示例：http://code.ciaoca.com/jquery/cxDialog/demo/

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
info|''|内容。可设置为文本内容，或 DOM 元素。
ok|null|点击确认时的回调函数
okText|'确 定'|确认按钮显示的文字
no|null|点击取消时的回调函数
noText|'取 消'|取消按钮显示的文字
buttons|[]|自定义按钮
closeBtn|true|是否显示关闭按钮
lockScroll|false|是否锁定滚动
baseClass|''|给对话框容器增加 class，不会覆盖默认的 class。
background|''|遮罩背景的颜色，留空为透明遮罩。<br>可设置为：HEX、RGBA 等格式的颜色值，或 CSS background 属性支持的值。<br>如不需要遮罩背景，设为：false
width|0|提示框固定宽度
height|0|提示框固定高度
zIndex|0|提示框的层级

## buttons 属性参数

名称|说明
---|---
text|按钮显示的文字
callback|回调函数

### API 接口性

名称|说明
---|---
$.cxDialog.close()|关闭对话框
