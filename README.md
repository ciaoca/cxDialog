# cxDialog

cxDialog 是基于 JavaScript 的对话框插件，支持自定义外观样式。

Demo: https://ciaoca.github.io/cxDialog/

>从 v2.0 开始，已移除 jQuery 的依赖，如果需要使用旧版，可查看 [v1 分支](https://github.com/ciaoca/cxDialog/tree/v1)。



## 安装方法

### 浏览器端引入

```html
<link rel="stylesheet" href="cxdialog.css">
<script src="cxdialog.js"></script>
```



### 从 NPM 安装，作为模块引入

```shell
npm install cxdialog
```

```javascript
import 'cxdialog.css';
import cxDialog from 'cxdialog';
```



### 使用

```javascript
// 简易的方式
cxDialog('内容');

cxDialog('内容', () => {
  // click ok callback
}, () => {
  // click no callback
});

// 传入参数
cxDialog({
  title: '标题',
  info: '内容',
  ok: () => {},
  no: () => {}
});
```



### 设置默认参数

``` javascript
cxDialog.defaults.title = '提示';
```



## 参数说明

名称|类型|默认值|说明
---|---|---|---
title|string|''|标题
info|string<br />element|''|内容，可设置为文本内容，或 DOM 元素
ok|function|undefined|确认按钮回调函数<br />※ 值为 `function` 类型时，才会显示对应按钮
no|function|undefined|取消按钮回调函数
okText|string|'确 定'|确认按钮文字
noText|string|'取 消'|取消按钮文字
buttons|array|[]|自定义按钮
baseClass|string|''|追加样式名称，不会覆盖默认的 class
maskClose|boolean|true|是否允许点击遮罩层关闭对话框



### buttons 参数

```javascript
cxDialog({
  info: '内容',
  buttons: [
    {
      text:'按钮1',
      callback: () => {}
    },
    {
      text:'按钮2',
      callback: () => {}
    }
  ]
});
```

名称|类型|说明
---|---|---
text|string|按钮文字
callback|function|回调函数



## API 接口

```javascript
cxDialog.close();
```

名称|说明
---|---
close|关闭对话框
