import './style.css';

const theTool = {
  dom: {},
  settings: {},
  queue: [],
  lock: false,

  isElement: function(o) {
    if (o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
      return true;
    } else {
      return (o && o.nodeType && o.nodeType === 1) ? true : false;
    };
  },
  isObject: function(value) {
    if (value === undefined || value === null || Object.prototype.toString.call(value) !== '[object Object]') {
      return false;
    };

    if (value.constructor && !Object.prototype.hasOwnProperty.call(value.constructor.prototype, 'isPrototypeOf')) {
      return false;
    };

    return true;
  },
};

// 合并对象
theTool.extend = function(target, ...sources) {
  const self = this;

  if (!self.isObject(target)) {
    return;
  };

  for (let x of sources) {
    if (!self.isObject(x)) {
      continue;
    };

    for (let y in x) {
      if (Array.isArray(x[y])) {
        target[y] = [].concat(x[y]);

      } else if (self.isObject(x[y])) {
        if (!self.isObject(target[y])) {
          target[y] = {};
        };
        self.extend(target[y], x[y]);

      } else {
        target[y] = x[y];
      };
    };
  };

  return target;
};

theTool.init = function() {
  const self = this;

  self.buildStage();
  self.bindEvent();
};

// 构建组件
theTool.buildStage = function() {
  const self = this;

  self.dom.wrap = document.createElement('div');
  self.dom.wrap.classList.add('cxdialog');

  self.dom.box = document.createElement('div');
  self.dom.box.classList.add('cxdialog_box');

  self.dom.mask = document.createElement('div');
  self.dom.mask.classList.add('cxdialog_mask');

  self.dom.holder = document.createElement('div');
  self.dom.holder.classList.add('cxdialog_holder');

  self.dom.wrap.insertAdjacentElement('beforeend', self.dom.mask);
  self.dom.wrap.insertAdjacentElement('beforeend', self.dom.box);
  document.body.insertAdjacentElement('beforeend', self.dom.wrap);
};

// 绑定事件
theTool.bindEvent = function() {
  const self = this;

  self.dom.mask.addEventListener('click', () => {
    if (self.settings.maskClose) {
      self.exit();
    };
  });

  self.dom.wrap.addEventListener('click', (e) => {
    const el = e.target;
    const nodeName = el.nodeName.toLowerCase();
    let result;

    if (nodeName === 'a' && el.rel === 'cxdialog') {
      event.preventDefault();

      if (Array.isArray(self.cacheBtnFun) && self.cacheBtnFun.length) {
        for (let x of self.cacheBtnFun) {
          if (x.name === el.rev && typeof x.callback === 'function') {
            result = x.callback();
            break;
          };
        };
      };

      if (result !== false) {
        self.exit();
      };
    };
  });
};

// 设置内容
theTool.setContent = function() {
  const self = this;
  const nowtime = new Date().getTime();
  let html = '';

  self.dom.box.innerHTML = '';

  // 标题
  if (typeof self.settings.title === 'string' && self.settings.title.length) {
    html += '<div class="cxdialog_title">' + self.settings.title + '</div>';
  };


  // 内容为文本
  if (typeof self.settings.info === 'string') {
    html += '<div class="cxdialog_info">' + String(self.settings.info) + '</div>';

  // 内容为 DOM 元素
  } else if (self.isElement(self.settings.info)) {
    self.fillDom();
  };

  // 设置按钮
  self.cacheBtnFun = [];

  for (let x of ['ok', 'no']) {
    if (typeof self.settings[x] === 'function') {
      self.cacheBtnFun.push({
        name: x,
        className: x,
        text: self.settings[x + 'Text'],
        callback: self.settings[x]
      });
    };
  };

  for (let i = 0, l = self.settings.buttons.length; i < l; i++) {
    self.cacheBtnFun.push({
      name: 'btn_' + nowtime + '_' + i,
      className: 'btn_' + i,
      text: self.settings.buttons[i].text,
      callback: self.settings.buttons[i].callback
    });
  };

  if (self.cacheBtnFun.length) {
    html += '<div class="cxdialog_btns">';

    for (let x of self.cacheBtnFun) {
      html += '<a class="' + x.className + '" rel="cxdialog" rev="' + x.name + '">' + x.text + '</a>';
    };

    html += '</div>';
  };

  self.dom.box.insertAdjacentHTML('beforeend', html);

  if (self.cacheDom) {
    if (self.dom.box.querySelector('.cxdialog_title')) {
      self.dom.box.querySelector('.cxdialog_title').insertAdjacentElement('afterend', self.cacheDom.el);
    } else {
      self.dom.box.insertAdjacentElement('afterbegin', self.cacheDom.el);
    };
  };
};

// 填充占位符元素
theTool.fillDom = function() {
  const self = this;

  self.cacheDom = {
    el: self.settings.info,
    hasHolder: false
  };

  const inStyle = self.cacheDom.el.getAttribute('style');

  if (typeof inStyle === 'string') {
    self.cacheDom.styleText = inStyle;
  };

  const calcStyle = window.getComputedStyle(self.cacheDom.el);
  const holderStyle = [
    'visibility:hidden',
    'border-style:solid',
    'border-color:transparent'
  ];
  const calcDisplay = calcStyle.getPropertyValue('display');

  if (typeof calcDisplay === 'string' && calcDisplay.length) {
    for (let x of ['display', 'position', 'float', 'flex', 'width', 'height', 'margin', 'padding', 'border-width']) {
      const value = calcStyle.getPropertyValue(x);

      if (typeof value === 'string' && value.length) {
        holderStyle.push([x, value].join(':'));
      };
    };

    self.dom.holder.setAttribute('style', holderStyle.join(';'));
    self.cacheDom.el.insertAdjacentElement('afterend', self.dom.holder);
    self.cacheDom.hasHolder = true;
  };
};

// 归还加载的 DOM
theTool.backDom = function() {
  const self = this;

  if (!self.cacheDom || !self.isElement(self.cacheDom.el)) {
    return;
  };

  const calcStyle = window.getComputedStyle(self.cacheDom.el);
  const holderStyle = [
    'visibility:hidden',
    'border-style:solid',
    'border-color:transparent'
  ];

  for (let x of ['width', 'height', 'margin', 'padding', 'border-width']) {
    const value = calcStyle.getPropertyValue(x);

    if (typeof value === 'string' && value.length) {
      holderStyle.push([x, value].join(':'));
    };
  };

  self.dom.holder.setAttribute('style', holderStyle.join(';'));

  if (self.cacheDom.hasHolder) {
    self.dom.holder.insertAdjacentElement('afterend', self.cacheDom.el);
    self.dom.holder.parentNode.removeChild(self.dom.holder);
  };

  if (self.dom.box.querySelector('.cxdialog_title')) {
    self.dom.box.querySelector('.cxdialog_title').insertAdjacentElement('afterend', self.dom.holder);
  } else {
    self.dom.box.insertAdjacentElement('afterbegin', self.dom.holder);
  };

  if (typeof self.cacheDom.styleText === 'string' && self.cacheDom.styleText.length) {
    self.cacheDom.el.setAttribute('style', self.cacheDom.styleText);
  } else {
    self.cacheDom.el.removeAttribute('style');
  };

  if (self.dom.box.contains(self.cacheDom.el)) {
    self.dom.box.removeChild(self.cacheDom.el);
  };

  self.cacheDom = null;
};

// 显示对话框
theTool.show = function(options) {
  const self = this;
  const classValue = ['cxdialog', 'in'];

  self.lock = true;
  self.settings = self.extend({}, cxDialog.defaults, options);

  if (typeof self.settings.baseClass === 'string' && self.settings.baseClass.length) {
    classValue.push(self.settings.baseClass);
  };

  self.setContent();

  self.dom.wrap.className = classValue.join(' ');
};

// 关闭对话框
theTool.exit = function() {
  const self = this;

  self.backDom();
  self.lock = false;
  self.cacheBtnFun = null;

  self.dom.wrap.classList.remove('in');
  self.dom.wrap.classList.add('out');

  self.next();
};

// 加入队列
theTool.add = function(options, ok, no) {
  const self = this;
  const settings = {};

  if (typeof options === 'string' || self.isElement(options)) {
    settings.info = options;

  } else if (self.isObject(options)) {
    Object.assign(settings, options);

  } else if (options !== undefined && options !== null) {
    settings.info = String(options);
  };

  if (typeof ok === 'function') {
    settings.ok = ok;
  };

  if (typeof no === 'function') {
    settings.no = no;
  };

  self.queue.push(settings);
  self.next();
};

// 读取队列
theTool.next = function() {
  const self = this;

  if (self.lock) {
    return;
  };

  if (self.queue.length) {
    self.show(self.queue.shift());
  };
};

document.addEventListener('DOMContentLoaded', () => {
  theTool.init();
});


const cxDialog = function() {
  theTool.add(...arguments);
};

cxDialog.close = function() {
  theTool.exit.apply(theTool);
};

// 默认配置
cxDialog.defaults = {
  title: undefined,       // 标题
  info: undefined,        // 内容
  ok: undefined,          // 确认按钮回调函数
  no: undefined,          // 取消按钮回调函数
  okText: '确 定',        // 确认按钮文字
  noText: '取 消',        // 取消按钮文字
  buttons: [],            // 自定义按钮
  baseClass: undefined,   // 基础样式
  maskClose: true,        // 背景遮罩可关闭对话框
};

export default cxDialog;