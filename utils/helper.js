function time() {
    let time = Math.round(new Date().getTime() / 1000);
    return parseInt(time);
}

function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatData(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('-');
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 格式化电话号码，用空格分段
function formatPhone(phone){
  if (!phone) {
    return '';
  }

  // phone = phone.trim();
  // if (phone.length == 4) {
  //   phone = phone.replace(/(.{3})(.*)/, "$1 $2");
  // }
  // if (phone.length == 9) {
  //   phone = phone.replace(/(.{8})(.*)/, "$1 $2");
  // }
  // return phone;

  var temp_value = phone.split('');
  if (temp_value.length > 3) {
    temp_value.splice(3, 0, " ");
  }
  if (temp_value.length > 8) {
    temp_value.splice(8, 0, " ");
  }
  return temp_value.join('');
}

/*函数节流*/
function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 300;//间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/*函数防抖*/
function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}

// 米转公里
function getKilometre(metre){
  if (metre < 1000){
    return parseInt(metre) + "m";
  }
  else if (metre > 1000){
    return (Math.round(metre / 100) / 10).toFixed(1) + "km";
  }
}

// 比较两个json是否一样
function compreObj(obj1, obj2) {
  var flag = true;
  if (Object.keys(obj1).length != Object.keys(obj2).length) {
    return false;
  }
  for (let x in obj1) {
    if (!obj2.hasOwnProperty(x)) {
      return false;
    }

    var v_type = typeof obj1[x];
    if (v_type == "boolean" || v_type == "string" || v_type == "number") {
      if (obj1[x] !== obj2[x]) {
        return false;
      }
    }

    if (obj1[x] !== obj2[x]) {
      flag = compreObj(obj1[x], obj2[x]);
    }
    if (!flag) {
      return false;
    }
  }
  return true;
} 

module.exports = {
    formatTime: formatTime,
    formatData: formatData,
    formatPhone: formatPhone,
    getKilometre: getKilometre,
    throttle: throttle,
    debounce: debounce,
    compreObj: compreObj,
    scene_decode: function(scene) {
        var _str = scene + "";
        var _str_list = _str.split(",");
        var res = {};
        for (var i in _str_list) {
            var _tmp_str = _str_list[i];
            var _tmp_str_list = _tmp_str.split(":");
            if (_tmp_str_list.length > 0 && _tmp_str_list[0]) {
                res[_tmp_str_list[0]] = _tmp_str_list[1] || null;
            }
        }
        return res;
    },
    time: time,

    objectToUrlParams: function(obj, urlencode) {
        let str = "";
        for (let key in obj) {
            str += "&" + key + "=" + (urlencode ? encodeURIComponent(obj[key]) : obj[key]);
        }
        return str.substr(1);
    },
    inArray: function(val, arr) {
        return arr.some(function(v) {
            return val === v;
        })
    },
    min: function(var1, var2) {
        var1 = parseFloat(var1);
        var2 = parseFloat(var2);
        return var1 > var2 ? var2 : var1;
    },

    max: function (var1, var2) {
        var1 = parseFloat(var1);
        var2 = parseFloat(var2);
        return var1 < var2 ? var2 : var1;
    },

};