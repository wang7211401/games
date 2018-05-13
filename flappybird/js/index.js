
var app = {
  init:function(){
    this.g = 0.2 //向下加速度
    this.bird = document.getElementsByClassName('bird')[0]
    this.main = document.getElementsByClassName('main')[0]
    this.s = 0 //小鸟的速度向下为正
    this.birdTimer = null
    this.pipeTimer = null //两个计时器
    this.y = 100
    this.minY = 0
    this.maxY = 450 - 24 //小鸟的高度，0为天,450-24（小鸟的身高）为地
    this.playing = false //标记是否游戏中
    this.pipeData = [] //管道存放的数组
    this.scoreEl = document.getElementsByClassName('score')[0]
    this.score = 0
    var _this = this
    window.onkeydown = function (e) {
        if (e.keyCode == 13) {
            _this.playing || _this.startGame()
        }
        if (e.keyCode == 32) {
            _this.s = -4
        }
    }
  },
  startGame:function(){   /* 开始游戏，开始周期性渲染小鸟位置，生成管道，标记开始,初始化一些值 */
    this.playing = true
    this.y = 100
    this.score = 0
    this.scoreEl.innerHTML = this.score
    this.s = 0
    var _this = this
    this.pipeData.forEach(function (pipe) {
        _this.main.removeChild(pipe)
    })
    this.pipeData = []
    this.main.remove
    document.body.className = ''
    /* 15毫秒渲染一次小鸟 */
    this.birdTimer = setInterval(function () {
        _this.renderBird()
    }, 15)
    /* 1.5秒生成一对管道 */
    this.updatePipe()
    this.pipeTimer = setInterval(function () {
        _this.updatePipe()
    }, 1500)
  },
  renderBird:function(){  /* 渲染小鸟，计分，渲染后检测碰撞 */
    this.s = this.s + this.g
    this.y = this.y + this.s
    this.y = Math.max(this.minY, this.y)
    this.y = Math.min(this.maxY,this.y)
    this.bird.style = `top:${this.y}px`
    let currentPipe = this.pipeData[0] && this.pipeData[0].scoring ? this.pipeData[1] : this.pipeData[0]
    if ((!currentPipe.scoring) && currentPipe.offsetLeft < (150 - 50)) {
        this.score++
        this.scoreEl.innerHTML = this.score
        currentPipe.scoring = true
    }
    this.hitDetection()
  },
  updatePipe:function(){  /*更新管道，创建一对竖直位置随机的管道，并且移除用过的管道 */
    let upHeight = Math.round(Math.random() * 120 + 90) //控制高度在90-210之间
    let downHeight = 300 - upHeight
    let pipe = document.createElement('div')
    pipe.className = 'pipe'
    pipe.rangeMinY = upHeight //允许通过的最小y坐标，向下为正
    pipe.rangeMaxY = upHeight + 150 //允许通过的最大Y坐标
    pipe.innerHTML = `<div class="up" style="height:${upHeight}px"></div>
                    <div class="down" style="height:${downHeight}px"></div>`
    this.main.appendChild(pipe)
    this.pipeData.push(pipe)
    while (this.pipeData[0].offsetLeft == -52) {
        this.main.removeChild(this.pipeData[0])
        this.pipeData.shift()
    }
  },
  hitDetection:function(){  /* 碰撞检测 */
    var _this = this
    if (this.y == this.maxY) {
        _this.endGame()
    }
    this.pipeData.forEach(function (pipe) {
        if (pipe.offsetLeft >= (150 - 50) && pipe.offsetLeft <= (150 + 32)) {
            if (_this.y <= pipe.rangeMinY || _this.y >= (pipe.rangeMaxY - 24)) {
                _this.endGame()
            }
        }
    })
  },
  endGame:function(){  /* 结束游戏，停止周期计时,停止动画 */
    this.playing = false
    document.body.className = 'stop'
    clearInterval(this.birdTimer)
    clearInterval(this.pipeTimer)
  }
}

app.init()
