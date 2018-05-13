// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {

var app = {
    init: function init() {
        this.g = 0.2; //向下加速度
        this.bird = document.getElementsByClassName('bird')[0];
        this.main = document.getElementsByClassName('main')[0];
        this.s = 0; //小鸟的速度向下为正
        this.birdTimer = null;
        this.pipeTimer = null; //两个计时器
        this.y = 100;
        this.minY = 0;
        this.maxY = 450 - 24; //小鸟的高度，0为天,450-24（小鸟的身高）为地
        this.playing = false; //标记是否游戏中
        this.pipeData = []; //管道存放的数组
        this.scoreEl = document.getElementsByClassName('score')[0];
        this.start = document.querySelector('.start');
        this.score = 0;
        var _this = this;

        this.start.onclick = function () {
            _this.start.style.display = 'none';
            _this.playing || _this.startGame();
        };
        this.main.onclick = function () {
            _this.s = -4;
        };
        // document.ontouchstart = function(){
        //   _this.playing || _this.startGame()
        //   _this.playing = true
        //   _this.s = -4
        // }
        window.onkeydown = function (e) {
            if (e.keyCode == 13) {
                _this.start.style.display = 'none';
                _this.playing || _this.startGame();
            }
            if (e.keyCode == 32) {
                _this.s = -4;
            }
        };
    },
    startGame: function startGame() {
        /* 开始游戏，开始周期性渲染小鸟位置，生成管道，标记开始,初始化一些值 */
        this.playing = true;
        this.y = 100;
        this.score = 0;
        this.scoreEl.innerHTML = this.score;
        this.s = 0;
        var _this = this;
        this.pipeData.forEach(function (pipe) {
            _this.main.removeChild(pipe);
        });
        this.pipeData = [];
        this.main.remove;
        document.body.className = '';
        /* 15毫秒渲染一次小鸟 */
        this.birdTimer = setInterval(function () {
            _this.renderBird();
        }, 15);
        /* 1.5秒生成一对管道 */
        this.updatePipe();
        this.pipeTimer = setInterval(function () {
            _this.updatePipe();
        }, 1500);
    },
    renderBird: function renderBird() {
        /* 渲染小鸟，计分，渲染后检测碰撞 */
        this.s = this.s + this.g;
        this.y = this.y + this.s;
        this.y = Math.max(this.minY, this.y);
        this.y = Math.min(this.maxY, this.y);
        this.bird.style = 'top:' + this.y + 'px';
        var currentPipe = this.pipeData[0] && this.pipeData[0].scoring ? this.pipeData[1] : this.pipeData[0];
        if (!currentPipe.scoring && currentPipe.offsetLeft < 150 - 50) {
            this.score++;
            this.scoreEl.innerHTML = this.score;
            currentPipe.scoring = true;
        }
        this.hitDetection();
    },
    updatePipe: function updatePipe() {
        /*更新管道，创建一对竖直位置随机的管道，并且移除用过的管道 */
        var upHeight = Math.round(Math.random() * 120 + 90); //控制高度在90-210之间
        var downHeight = 300 - upHeight;
        var pipe = document.createElement('div');
        pipe.className = 'pipe';
        pipe.rangeMinY = upHeight; //允许通过的最小y坐标，向下为正
        pipe.rangeMaxY = upHeight + 150; //允许通过的最大Y坐标
        pipe.innerHTML = '<div class="up" style="height:' + upHeight + 'px"></div>\n                    <div class="down" style="height:' + downHeight + 'px"></div>';
        this.main.appendChild(pipe);
        this.pipeData.push(pipe);
        while (this.pipeData[0].offsetLeft == -52) {
            this.main.removeChild(this.pipeData[0]);
            this.pipeData.shift();
        }
    },
    hitDetection: function hitDetection() {
        /* 碰撞检测 */
        var _this = this;
        if (this.y == this.maxY) {
            _this.endGame();
        }
        this.pipeData.forEach(function (pipe) {
            if (pipe.offsetLeft >= 150 - 50 && pipe.offsetLeft <= 150 + 32) {
                if (_this.y <= pipe.rangeMinY || _this.y >= pipe.rangeMaxY - 24) {
                    _this.endGame();
                }
            }
        });
    },
    endGame: function endGame() {
        /* 结束游戏，停止周期计时,停止动画 */
        this.start.style.display = 'block';
        this.playing = false;
        document.body.className = 'stop';
        clearInterval(this.birdTimer);
        clearInterval(this.pipeTimer);
    }
};

app.init();
},{}],13:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '56371' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
      // Clear the console after HMR
      console.clear();
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[13,3], null)
//# sourceMappingURL=/js.ee15ff2f.map