#cxDialog

cxDialog 是基于 jQuery 的对话框插件，支持自定义外观样式，同时兼容 Zepto，方便在移动端使用。

**版本：**
* jQuery v1.7+ || Zepto 1.0+
* cxDialog v1.2.1

\* 兼容 Zepto，需要 [data 模块支持](https://github.com/madrobby/zepto/blob/master/src/data.js)

文档：http://code.ciaoca.com/jquery/cxdialog/

示例：http://code.ciaoca.com/jquery/cxdialog/demo/

##使用方法
###载入 CSS 文件
```html
<link rel="stylesheet" href="jquery.cxdialog.css">
```

###载入 JavaScript 文件
```html
<script src="jquery.js"></script>
<script src="jquery.cxdialog.js"></script>
```

###调用 cxDialog
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

###设置全局默认值
``` javascript
$.cxDialog.defaults.title = '提示';
```

##参数说明
<table class="manual_table table_form">
	<thead>
		<tr>
			<th width="160">名称</th>
			<th width="160">默认值</th>
			<th>说明</th>
		</tr>
	</thead>
	<tr>
		<td>title</td>
		<td>''</td>
		<td>标题</td>
	</tr>
	<tr>
		<td>info</td>
		<td>''</td>
		<td>内容。可设置为文本内容，或 DOM 元素。</p>
		</td>
	</tr>
	<tr>
		<td>ok</td>
		<td>null</td>
		<td>点击确认时的回调函数</td>
	</tr>
	<tr>
		<td>okText</td>
		<td>'确 定'</td>
		<td>确认按钮显示的文字</td>
	</tr>
	<tr>
		<td>no</td>
		<td>null</td>
		<td>点击取消时的回调函数</td>
	</tr>
	<tr>
		<td>noText</td>
		<td>'取 消'</td>
		<td>取消按钮显示的文字</td>
	</tr>
	<tr>
		<td>buttons</td>
		<td>[]</td>
		<td>自定义按钮</td>
	</tr>
	<tr>
		<td>closeBtn</td>
		<td>true</td>
		<td>是否显示关闭按钮</td>
	</tr>
	<tr>
		<td>lockScroll</td>
		<td>false</td>
		<td>是否锁定滚动</td>
	</tr>
	<tr>
		<td>baseClass</td>
		<td>''</td>
		<td>给对话框容器增加 class，不会覆盖默认的 class。</td>
	</tr>
	<tr>
		<td>background</td>
		<td>''</td>
		<td><p>遮罩背景的颜色，留空表示不需要遮罩。</p>
			<p>可设置为：HEX、RGBA 等 CSS background 属性支持的值。</p>
		</td>
	</tr>
	<tr>
		<td>width</td>
		<td>0</td>
		<td>提示框固定宽度</td>
	</tr>
	<tr>
		<td>height</td>
		<td>0</td>
		<td>提示框固定高度</td>
	</tr>
	<tr>
		<td>zIndex</td>
		<td>0</td>
		<td>提示框的层级</td>
	</tr>
</table>

##buttons 属性参数
<table>
    <tr>
        <th width="160">名称</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>text</td>
        <td>按钮显示的文字</td>
    </tr>
    <tr>
        <td>callback</td>
        <td>回调函数</td>
    </tr>
</table>

###API 接口
<table>
    <tr>
        <th width="160">名称</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>$.cxDialog.close()</td>
        <td>关闭对话框</td>
    </tr>
</table>
