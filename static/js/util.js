// function getDomByClass(class_name) {
//   return document.getElementsByClassName(class_name);//结果为数组
// }
//
// function getDomById(id) {
//   return document.getElementById(id);
// }
//
// function getDomByTag(tag) {
//   return document.getElementsByTagName(tag);
// }
//
// export {
//   getDomByClass,
//   getDomById,
//   getDomByTag
// }
const util = {};

util.getDomByClass = function (class_name) {
  return document.getElementsByClassName(class_name);//结果为数组
};
util.getDomById = function (id) {
  return document.getElementById(id);
};
util.getDomByTag = function (tag) {
  return document.getElementsByTagName(tag);
};
util.getFormatDate = function (dateObj) {
  let year = dateObj.getFullYear();
  let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
  let day = ("0" + dateObj.getDate()).slice(-2);
  let hour = ("0" + dateObj.getHours()).slice(-2);
  let minute = ("0" + dateObj.getMinutes()).slice(-2);
  let second = ("0" + dateObj.getSeconds()).slice(-2);

  return year + "-" + month + "-" + day + ' ' + hour + ':' + minute + ':' + second;
};

util.isScrollOver = function (className) {
  //判断某元素是否滚出可视区域
  return document.getElementsByClassName(className)[0].clientHeight - document.documentElement.scrollTop <= 0;
};
util.isVisible = function (className) {
  //判断某元素是否可见。注意，窗口高度+滚动距离
  return document.getElementsByClassName(className)[0].offsetTop - document.documentElement.scrollTop - window.innerHeight < 0;
};
util.hasClass = function (ele, cls) {
  return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
};
util.addClass = function (ele, cls) {
  if (!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"))) ele.className += " " + cls;
};
util.removeClass = function (ele, cls) {
  if (ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"))) {
    let reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
};
util.HTMLEncode = function (html) {
  const WIDTH = 125;
  let temp = document.createElement("div");
  temp.innerHTML = html;
  let output = temp.innerText || temp.textContent;
  temp = null;
  if (output.length > WIDTH) {
    output = output.substring(0, WIDTH) + '...';
  }
  return output;
};

export default util;