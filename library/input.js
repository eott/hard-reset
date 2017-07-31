Input = function(app) {
    this.app = app

    this.keyStatus = [0, 0, 0, 0, 0]
    
    this.mouseStatus = 0
    this.mouseDiff = [0, 0]
    this.mousePos = [0, 0]

    this.registerListeners()
}

Input.prototype.mouseUpDown = function(ev) {
    if (!this.app.gameHasStarted) {
        this.app.gameHasStarted = true
    }

    if (this.mouseStatus == 1 && ev.buttons == 0) {
        this.app.systems.handleMouseClick(ev)
    }

    this.mouseStatus = ev.buttons
}

Input.prototype.mouseMove = function(ev) {
    if (!this.app.gameHasStarted) {
        return
    }

    this.mouseDiff = [ev.layerX - this.mousePos[0], ev.layerY - this.mousePos[1]]
    this.mousePos = [ev.layerX, ev.layerY]

    if (this.mouseStatus == 1) {
        this.app.shiftX += this.mouseDiff[0]
        this.app.shiftY += this.mouseDiff[1]
        this.app.shiftX = Math.min(1000, Math.max(-200, this.app.shiftX))
        this.app.shiftY = Math.min(1000, Math.max(-400, this.app.shiftY))
    }
}

Input.prototype.keyEvent = function(type, key) {
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

Input.prototype.registerListeners = function() {
    window.addEventListener("keydown", function(e) {this.keyEvent(1, e.keyCode);}, false)
    window.addEventListener("keyup", function(e) {this.keyEvent(0, e.keyCode);}, false)
}