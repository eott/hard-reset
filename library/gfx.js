GFX = function(app) {
    this.app = app
    this.ctx = app.ctx
}

GFX.prototype.circle = function(x, y, radius, color, width, fill) {
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    this.ctx.lineWidth = width
    this.ctx.strokeStyle = color
    this.ctx.fillStyle = color
    if (fill) {
        this.ctx.fill()
    } else {
        this.ctx.stroke()
    }
}

GFX.prototype.drawMinimap = function(systems) {
    this.ctx.fillStyle = "#000000"
    this.ctx.strokeStyle = "#999999"
    this.ctx.lineWidth = 3

    // Draw background and outer box
    this.ctx.fillRect(650, 0, 150, 150)
    this.ctx.beginPath()
    this.ctx.moveTo(650, 0)
    this.ctx.lineTo(800, 0)
    this.ctx.lineTo(800, 150)
    this.ctx.lineTo(650, 150)
    this.ctx.closePath()
    this.ctx.stroke()

    // Draw systems
    for (var i = 0; i < systems.length; i++) {
        if (i == 0) {
            this.circle(725 + 150 * systems[i].x / 2000, 75 + 150 * systems[i].y / 2000, 2, "#ff0000", 1, true)
        } else {
            this.circle(725 + 150 * systems[i].x / 2000, 75 + 150 * systems[i].y / 2000, 2, "#ffffff", 1, true)
        }
    }

    // Draw shift rectangle
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = "#888888"
    var dx = 75 - this.app.shiftX * 75 / 1000
    var dy = 75 - this.app.shiftY * 75 / 1000
    this.ctx.beginPath()
    this.ctx.moveTo(650 + dx, 0 + dy)
    this.ctx.lineTo(710 + dx, 0 + dy)
    this.ctx.lineTo(710 + dx, 45 + dy)
    this.ctx.lineTo(650 + dx, 45 + dy)
    this.ctx.closePath()
    this.ctx.stroke()


    /*this.ctx.lineWidth = 1
    this.ctx.strokeStyle = "#888888"
    var dx = 75 * this.app.shiftX / 1800
    var dy = 75 * this.app.shiftY / 1600
    this.ctx.beginPath()
    this.ctx.moveTo(650 + 75 - dx, 0 + 75 - dy)
    this.ctx.lineTo(725 + 75 - dx, 0 + 75 - dy)
    this.ctx.lineTo(725 + 75 - dx, 56 + 75 - dy)
    this.ctx.lineTo(650 + 75 - dx, 56 + 75 - dy)
    this.ctx.closePath()
    this.ctx.stroke()*/
}