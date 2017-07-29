App = function() {
    this.can = document.getElementById("screen")
    this.ctx = this.can.getContext("2d")
    this.keyStatus = [0, 0, 0, 0, 0]

    this.registerListeners()

    this.loop = window.setInterval('app.gameLoop()', 50);
}

App.prototype.gameLoop = function() {

}

App.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.can.width, this.can.height)

    this.ctx.font = "17px Consolas"
    this.ctx.fillStyle = "#ffffff"
}

App.prototype.keyEvent = function(type, key) {
    // w = 87, a = 65, s = 83, d = 68, space = 32
    var index = [87, 65, 83, 68, 32].indexOf(key)
    
    if (index == -1) {
        return
    }

    this.keyStatus[index] = type

    if (this.keyStatus[index] == 0 && type == 1) {
        this.keyStatus[index] = 1
    } else if (this.keyStatus[index] > 0 && type == 0) {
        this.keyStatus[index] = 0
    }
}

App.prototype.registerListeners = function() {
    window.addEventListener("keydown", function(e) {app.keyEvent(1, e.keyCode);}, false);
    window.addEventListener("keyup", function(e) {app.keyEvent(0, e.keyCode);}, false);
}