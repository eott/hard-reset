StarSystems = function(app) {
    this.app = app
    this.gfx = app.gfx

    this.debugPoints = []

    this.init()
}

StarSystems.prototype.init = function() {
    for (var i = 0; i < 100; i++) {
        this.debugPoints[i] = [Math.random() * 2000 - 1000, Math.random() * 2000 - 1000]
    }
}

StarSystems.prototype.draw = function() {
    for (var i = 0; i < 100; i++) {
        // Draw aura
        var x = this.app.shiftX + this.debugPoints[i][0]
        var y = this.app.shiftY + this.debugPoints[i][1]
        var grad = this.app.ctx.createRadialGradient(x, y, 0, x, y, 50)
        grad.addColorStop(0, 'rgba(255,40,40,0.2)')
        grad.addColorStop(1, 'rgba(255,40,40,0.0)')
        this.gfx.circle(x, y, 50, grad, 1, true)
        // Draw body
        this.gfx.circle(x, y, 3, '#ff2828', 1, true)
    }
}