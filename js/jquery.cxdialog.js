/*!
 * jQuery cxDialog 1.2.1
 * http://code.ciaoca.com/
 * https://github.com/ciaoca/cxDialog
 * E-mail: ciaoca@gmail.com
 * Released under the MIT license
 * Date: 2014-01-06
 *
 * 简易调用：$.cxDialog(string, [ok, no])
 * 完整方法：$.cxDialog(opt)
 * @param {object|string} opt 参数设置 or 内容
 *   title {string} 标题
 *   info {string|dom} 内容
 *   ok {fn} 点击确认时的回调函数
 *   okText {string} 确认按钮文字
 *   no {fn} 点击取消时的回调函数
 *   noText {string} 取消按钮文字
 *   buttons {array} 自定义按钮：[{text: 'text', callback: fn}, ...]
 *   closeBtn {boolean} 是否显示关闭按钮
 *   lockScroll {boolean} 是否锁定滚动
 *   baseClass {string} 给对话框容器增加 class，不会覆盖默认的 class
 *   background {string} 遮罩背景的颜色，留空表示不需要遮罩
 *   width {int} 提示框固定宽度
 *   height {int} 提示框固定高度
 *   zIndex {int} 提示框的层级
 *
 * @param {function} ok 点击确认时的回调函数
 * @param {function} no 点击取消时的回调函数
 */
(function(factory){
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	};
}(function($){
	if (typeof Zepto === 'function' || typeof Zepto === 'object') {
		// Add inner and outer width to zepto (adapted from https://gist.github.com/alanhogan/3935463)
		var ioDim = function(dimension, includeBorder) {
			return function (includeMargin) {
				var sides, size, elem;
				if (this) {
					elem = this;
					size = elem[dimension]();
					sides = {
						width: ['left', 'right'],
						height: ['top', 'bottom']
					};
					sides[dimension].forEach(function(side) {
						size += parseInt(elem.css('padding-' + side), 10);
						if (includeBorder) {
							size += parseInt(elem.css('border-' + side + '-width'), 10);
						};
						if (includeMargin) {
							size += parseInt(elem.css('margin-' + side), 10);
						};
					});
					return size;
				} else {
					return null;
				};
			};
		};
		['width', 'height'].forEach(function(dimension) {
			var Dimension = dimension.substr(0,1).toUpperCase() + dimension.substr(1);
			Zepto.fn['inner' + Dimension] = ioDim(dimension, false);
			Zepto.fn['outer' + Dimension] = ioDim(dimension, true);
		});
	};

	var isIE6 = !!window.ActiveXObject && !window.XMLHttpRequest;

	var dialog = {
		dom: {},
		isElement: function(o){
			if (o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
				return true;
			} else {
				return (o && o.nodeType && o.nodeType === 1) ? true : false;
			};
		},
		isJquery: function(o){
			return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
		},
		isZepto: function(o){
			return (o && o.length && (typeof Zepto === 'function' || typeof Zepto === 'object') && Zepto.zepto.isZ(o)) ? true : false;
		}
	};

	dialog.init = function(opt, ok, no){
		var _this = this;

		_this.dom.docHtml = $('html');
		_this.dom.docBody = $('body');
		_this.dom.box = $('<div></div>', {'id': 'cxdialog', 'class': 'cxdialog'});
		_this.dom.overlay = $('<div></div>', {'id': 'cxdialog_overlay', 'class': 'cxdialog_overlay'});
		_this.dom.holder = $('<div></div>', {'id': 'cxdialog_holder', 'class': 'cxdialog_holder'});
		_this.dom.title = $('<div></div>', {'class': 'cxdialog_title'});
		_this.dom.info = $('<div></div>', {'class': 'cxdialog_info'});
		_this.dom.btns = $('<div></div>', {'class': 'cxdialog_btns'});
		_this.dom.closeBtn = $('<a></a>', {'rel': 'cxdialog', 'rev': 'close'});

		_this.dom.box.on('click', 'a', function(){
			var _rel = this.rel;
			var _rev = this.rev;
			var _result;

			if (_rel !== 'cxdialog') {return};

			if (_rev === 'close') {
				_this.exit();

			} else {
				for (var i = 0, l = _this.btnCache.length; i < l; i++) {
					if (_this.btnCache[i].name === _rev && typeof _this.btnCache[i].callback === 'function') {
						_result = _this.btnCache[i].callback();
						break;
					};
				};
			};

			if (_result !== false) {
				_this.exit();
			};

			return false;
		});
	};

	dialog.format = function(opt, ok, no){
		var _this = this;
		_this.exit();

		if (typeof opt === 'string' && !opt.length) {return};

		if (typeof opt === 'string' || _this.isElement(opt) || _this.isJquery(opt) || _this.isZepto(opt)) {
			opt = {
				info: opt
			};
		} else if (typeof opt !== 'object') {
			return;
		};

		if (typeof ok === 'function') {opt.ok = ok};
		if (typeof no === 'function') {opt.no = no};

		opt = $.extend({}, $.cxDialog.defaults, opt);

		_this.setContent(opt);
		_this.show(opt);
	};

	// 设置内容
	dialog.setContent = function(opt){
		var _this = this;
		var _timeStamp = new Date().getTime();

		// 设置标题
		if (typeof opt.title === 'string' && opt.title.length) {
			_this.dom.title.html(opt.title).appendTo(_this.dom.box);
		};

		// 设置文本内容
		_this.infoCache = undefined;

		if (typeof opt.info === 'string' && opt.info.length) {
			_this.dom.info.html(opt.info).appendTo(_this.dom.box);

		// 设置内容为 DOM 元素或 jQuery 对象
		} else if (_this.isElement(opt.info) || _this.isJquery(opt.info) || _this.isZepto(opt.info)) {
			if (_this.isElement(opt.info)) {
				_this.infoCache = $(opt.info);
			} else {
				_this.infoCache = opt.info;
			};

			var _cssFloat = _this.infoCache.css('float');
			var _cssDisplay = _this.infoCache.css('display');
			var _cssVisibility = _this.infoCache.css('visibility');

			_this.dom.holder.css({
				'float': _cssFloat,
				'display': _cssDisplay,
				'visibility': _cssVisibility,
				'width': _this.infoCache.outerWidth(),
				'height': _this.infoCache.outerHeight()
			}).data({
				'float': _cssFloat,
				'display': _cssDisplay,
				'visibility': _cssVisibility
			}).insertAfter(_this.infoCache);

			_this.infoCache.show().appendTo(_this.dom.box);
		};

		// 设置按钮
		_this.btnCache = [];

		if (typeof opt.ok === 'function') {
			_this.btnCache.push({
				name: 'btn_ok',
				className: 'btn_ok',
				text: opt.okText,
				callback: opt.ok
			});
		};
		if (typeof opt.no === 'function') {
			_this.btnCache.push({
				name: 'btn_no',
				className: 'btn_no',
				text: opt.noText,
				callback: opt.no
			});
		};

		for (var i = 0, l = opt.buttons.length; i < l; i++) {
			_this.btnCache.push({
				name: 'btn_' + _timeStamp + '_' + i,
				className: 'btn_' + i,
				text: opt.buttons[i].text,
				callback: opt.buttons[i].callback
			});
		};

		if (_this.btnCache.length) {
			var _html = '';
			for (var i = 0, l = _this.btnCache.length; i < l; i++) {
				_html += '<a class="' + _this.btnCache[i].className + '" rel="cxdialog" rev="' + _this.btnCache[i].name + '">' + _this.btnCache[i].text + '</a>';
			};
			_this.dom.btns.html(_html).appendTo(_this.dom.box);
		};

		// 关闭按钮
		if (opt.closeBtn) {
			_this.dom.closeBtn.appendTo(_this.dom.box);
		};
	};

	// 显示对话框
	dialog.show = function(opt){
		var _this = this;
		_this.dom.docBody.append(_this.dom.box);

		if (opt.lockScroll === true) {
			_this.dom.docHtml.addClass('cxdialog_lock');
		};

		if (typeof opt.background && opt.background.length) {
			_this.dom.overlay.css('background', opt.background).appendTo(_this.dom.docBody).css('display', 'block');
		};

		_this.dom.box.css('display', 'block');

		var _cssAttr = {};

		// IE6 不支持 fixed，设置当前位置
		if (isIE6) {
			_cssAttr.top = document.documentElement.scrollTop + window.screen.availHeight / 4;
		};

		if (opt.width > 0) {
			_cssAttr.width = opt.width;
			_cssAttr.marginLeft = -(opt.width / 2);
		} else {
			_cssAttr.marginLeft = -(_this.dom.box.outerWidth() / 2);
		};

		if (opt.height > 0) {
			_cssAttr.height = opt.height;
			_cssAttr.marginTop = -(opt.height / 2);
		} else {
			_cssAttr.marginTop = -(_this.dom.box.outerHeight() / 2);
		};

		if (opt.zIndex > 0) {
			_cssAttr.zIndex = opt.zIndex;
		};


		if (typeof opt.baseClass === 'string' && opt.baseClass.length) {
			_this.dom.box.addClass(opt.baseClass);
		};

		_this.dom.box.css(_cssAttr);

	};

	// 归还加载的 DOM
	dialog.backDom = function(){
		var _this = this;

		if (_this.isJquery(_this.infoCache) || _this.isZepto(_this.infoCache)) {
			_this.infoCache.css({
				'float': '',
				'display': '',
				'visibility': ''
			}).insertAfter(_this.dom.holder);

			_this.dom.holder.remove();
		};
	};

	// 关闭对话框
	dialog.exit = function(){
		var _this = this;

		_this.backDom();

		_this.infoCache = undefined;
		_this.btnCache = undefined;

		_this.dom.box.attr('class', 'cxdialog').empty().hide();
		_this.dom.overlay.hide();
		_this.dom.docHtml.removeClass('cxdialog_lock');
	};

	$(function(){
		dialog.init();
	});

	$.cxDialog = function(){
		dialog.format.apply(dialog, arguments);
	};

	$.cxDialog.defaults = {
		title: '',
		info: '',
		ok: null,
		okText: '确 定',
		no: null,
		noText: '取 消',
		buttons: [],
		closeBtn: true,
		lockScroll: false,
		baseClass: '',
		background: '',
		width: 0,
		height: 0
	};

	$.cxDialog.close = function(){
		dialog.exit.apply(dialog);
	};
}));