/*!
 * jQuery cxDialog
 * 
 * @version 1.3.0
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxDialog
 * @license Released under the MIT license
 */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(window.jQuery || window.Zepto || window.$);
  };
}(function($) {
  var dialog = {
    dom: {},
    isElement: function(o) {
      if (o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
        return true;
      } else {
        return (o && o.nodeType && o.nodeType === 1) ? true : false;
      };
    },
    isJquery: function(o) {
      return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
    },
    isZepto: function(o) {
      return (o && o.length && (typeof Zepto === 'function' || typeof Zepto === 'object') && Zepto.zepto.isZ(o)) ? true : false;
    }
  };

  dialog.init = function() {
    var self = this;

    self.dom.wrap = $('<div></div>', {'id': 'cxdialog', 'class': 'cxdialog'});
    self.dom.box = $('<div></div>', {'class': 'box'});
    self.dom.mask = $('<div></div>', {'class': 'mask'});
    self.dom.holder = $('<div></div>', {'class': 'cxdialog_holder'});

    self.dom.wrap.append(self.dom.mask).append(self.dom.box);

    self.dom.mask.on('click', function() {
      if (this.dataset.close) {
        self.exit();
      };
    });

    self.dom.wrap.on('click', 'a', function() {
      var _this = this;
      var _rel = _this.rel;
      var _rev = _this.rev;
      var _result;

      if (_rel === 'cxdialog') {
        event.preventDefault();

        if (_rev === 'close') {
          self.exit();

        } else if (Array.isArray(self.btnCache) && self.btnCache.length) {
          for (var i = 0, l = self.btnCache.length; i < l; i++) {
            if (self.btnCache[i].name === _rev && typeof self.btnCache[i].callback === 'function') {
              _result = self.btnCache[i].callback();
              break;
            };
          };
        };

        if (_result !== false) {
          self.exit();
        };
      };
    });

    document.addEventListener('DOMContentLoaded', function() {
      self.dom.wrap.appendTo('body');
    });
  };

  // 配置参数
  dialog.setOptions = function(options, ok, no) {
    var self = this;

    if (typeof options === 'string' || self.isElement(options) || self.isJquery(options) || self.isZepto(options)) {
      options = {
        info: options
      };

    } else if (typeof options !== 'object') {
      return;
    };

    if (typeof ok === 'function') {
      options.ok = ok;
    };

    if (typeof no === 'function') {
      options.no = no;
    };

    options = $.extend({}, $.cxDialog.defaults, options);

    self.dom.wrap.attr('class', 'cxdialog');

    self.setContent(options);
    self.show(options);
  };

  // 设置内容
  dialog.setContent = function(options) {
    var self = this;
    var html = '';
    var nowtime = new Date().getTime();

    self.dom.box.empty();

    if (options.maskClose) {
      self.dom.mask.data('close', 1);
    };

    // 标题
    if (typeof options.title === 'string' && options.title.length) {
      html += '<div class="title">' + options.title + '</div>';
    };

    self.backDom();

    // 内容为文本
    if (typeof options.info === 'string' && options.info.length) {
      html += '<div class="info">' + options.info + '</div>';

    // 内容为 DOM 元素或 jQuery, Zepto 对象
    } else if (self.isElement(options.info) || self.isJquery(options.info) || self.isZepto(options.info)) {
      self.infoCache = {
        dom: self.isElement(options.info) ? $(options.info) : options.info
      };

      var cssStyle = self.infoCache.dom.css(['display','visibility','position','float','flex','margin','padding','borderWidth']);
      var inlineStyle = self.infoCache.dom.attr('style');

      self.dom.holder.css({
        'display': cssStyle.display,
        'visibility': cssStyle.visibility,
        'position': cssStyle.position,
        'float': cssStyle.float,
        'flex': cssStyle.flex,
        'padding': cssStyle.padding,
        'margin': cssStyle.margin,
        'borderWidth': cssStyle.borderWidth,
        'borderStyle': 'solid',
        'borderColor': 'transparent',
        'width': self.infoCache.dom.width(),
        'height': self.infoCache.dom.height()
      }).insertAfter(self.infoCache.dom);

      if (typeof inlineStyle === 'string' && inlineStyle.length) {
        self.infoCache.styleText = inlineStyle;
      };

      self.infoCache.dom.css('display', 'block').appendTo(self.dom.box);

    // 其他内容强制转换为字符
    } else {
      html += '<div class="info">' + String(options.info) + '</div>';
    };

    // 设置按钮
    self.btnCache = [];

    if (typeof options.ok === 'function') {
      self.btnCache.push({
        name: 'btn_ok',
        className: 'btn_ok',
        text: options.okText,
        callback: options.ok
      });
    };

    if (typeof options.no === 'function') {
      self.btnCache.push({
        name: 'btn_no',
        className: 'btn_no',
        text: options.noText,
        callback: options.no
      });
    };

    for (var i = 0, l = options.buttons.length; i < l; i++) {
      self.btnCache.push({
        name: 'btn_' + nowtime + '_' + i,
        className: 'btn_' + i,
        text: options.buttons[i].text,
        callback: options.buttons[i].callback
      });
    };

    if (self.btnCache.length) {
      html += '<div class="btns">';

      for (var i = 0, l = self.btnCache.length; i < l; i++) {
        html += '<a class="' + self.btnCache[i].className + '" rel="cxdialog" rev="' + self.btnCache[i].name + '">' + self.btnCache[i].text + '</a>';
      };

      html += '</div>';
    };

    html += '<a class="close" rel="cxdialog" rev="close"></a>';

    self.dom.box.html(html);

    if (self.infoCache) {
      self.dom.box.find('.btns').before(self.infoCache.dom);
    };
  };

  // 显示对话框
  dialog.show = function(options) {
    var self = this;

    if (typeof options.baseClass === 'string' && options.baseClass.length) {
      self.dom.wrap.addClass(options.baseClass);
    };

    self.dom.wrap.addClass('in');
    document.body.classList.add('cxdialog_lock');
  };

  // 关闭对话框
  dialog.exit = function() {
    var self = this;

    self.backDom();
    self.btnCache = null;

    self.dom.wrap.removeClass('in').addClass('out');
    document.body.classList.remove('cxdialog_lock');
  };

  // 归还加载的 DOM
  dialog.backDom = function() {
    var self = this;

    if (self.infoCache && (self.isJquery(self.infoCache.dom) || self.isZepto(self.infoCache.dom))) {
      if (typeof self.infoCache.styleText === 'string' && self.infoCache.styleText.length) {
        self.infoCache.dom.attr('style', self.infoCache.styleText);
      } else {
        self.infoCache.dom.removeAttr('style');
      };

      self.infoCache.dom.insertAfter(self.dom.holder);
      self.dom.holder.remove().removeAttr('style');
    };

    self.infoCache = null;
  };

  $.cxDialog = function() {
    dialog.setOptions.apply(dialog, arguments);
  };

  $.cxDialog.close = function() {
    dialog.exit.apply(dialog);
  };

  $.cxDialog.defaults = {
    title: '',
    info: '',
    ok: null,
    okText: '确 定',
    no: null,
    noText: '取 消',
    buttons: [],
    baseClass: '',
    maskClose: true,
  };

  dialog.init();
}));