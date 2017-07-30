StarSystems = function(app) {
    this.app = app
    this.ctx = app.ctx
    this.gfx = app.gfx

    this.systems = []
    this.nrOfSystems = 10

    this.flows = []
    this.isDrawingFlow = false
    this.flowSource = undefined

    this.boundingBox = [200, 300]

    this.init()
}

StarSystems.prototype.init = function() {
    var nrCreated = 0
    while (nrCreated < this.nrOfSystems) {
        newSystem = {}
        isValid = true

        newSystem.resources = {}
        newSystem.resources.flux = 1e6
        newSystem.resources.am = 0
        newSystem.resources.sm = 1e6
        newSystem.resources.se = 1e9
        newSystem.producesAM = true

        if (nrCreated == 0) {
            newSystem.x = 350
            newSystem.y = 200
            newSystem.name = "Alpha Black"
            newSystem.colorAura = [255, 255, 255]
            newSystem.colorBody = [0, 0, 0]
            newSystem.resources.se = 0
            newSystem.resources.flux = 0
        } else {
            newSystem.x = Math.random() * 2000 - 1000
            newSystem.y = Math.random() * 2000 - 1000
            newSystem.name = this.createName()
            newSystem.colorAura = [255, 50, 0]
            newSystem.colorBody = [255, 50, 50]
        }

        for (var i = 0; i < this.systems.length; i++) {
            if (
                (
                    (
                        (newSystem.x + this.boundingBox[0] >= this.systems[i].x
                            && newSystem.x + this.boundingBox[0] <= this.systems[i].x + this.boundingBox[0]
                        )
                        || (newSystem.x >= this.systems[i].x
                            && newSystem.x <= this.systems[i].x + this.boundingBox[0]
                        )
                    )
                    && (
                        (newSystem.y + this.boundingBox[1] >= this.systems[i].y
                            && newSystem.y + this.boundingBox[1] <= this.systems[i].y + this.boundingBox[1]
                        )
                        || (newSystem.y >= this.systems[i].y
                            && newSystem.y <= this.systems[i].y + this.boundingBox[1]
                        )
                    )
                )
                || newSystem.name == this.systems[i].name
            ) {
                isValid = false
            }
        }

        if (isValid) {
            this.systems[this.systems.length] = newSystem
            nrCreated++
        }
    }
}

StarSystems.prototype.createName = function() {
    letters = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta",
        "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omikron", "Pi",
        "Rho", "Sigma", "Tau", "Upsilion", "Phi", "Xi", "Psi", "Omega"]
    colors = ["Black", "White", "Red", "Blue", "Yellow", "Violet", "Green", "Magenta",
        "Cyan", "Orange", "Brown", "Pink", "Grey", "Amber", "Lavender", "Lime",
        "Navy", "Ochre", "Scarlet"]

    return letters[Math.floor(Math.random() * letters.length)] + " "
            + colors[Math.floor(Math.random() * colors.length)]
}

StarSystems.prototype.draw = function() {
    for (var i = 0; i < this.nrOfSystems; i++) {
        var x = this.app.shiftX + this.systems[i].x
        var y = this.app.shiftY + this.systems[i].y

        // Draw bounding box
        this.ctx.strokeStyle = "#ffffff"
        this.ctx.fillStyle = "#ffffff"
        this.ctx.lineWidth = 2
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(x + this.boundingBox[0], y)
        this.ctx.lineTo(x + this.boundingBox[0], y + this.boundingBox[1])
        this.ctx.lineTo(x, y + this.boundingBox[1])
        this.ctx.closePath()
        this.ctx.stroke()

        // Write name
        this.ctx.fillText(this.systems[i].name, x + 10, y + 20)

        // Write resources
        this.ctx.fillText("Fx: " + this.systems[i].resources.flux.toExponential(2), x + 10, y + 120)
        this.ctx.fillText("AM: " + this.systems[i].resources.am.toExponential(2), x + 10, y + 140)
        this.ctx.fillText("SM: " + this.systems[i].resources.sm.toExponential(2), x + 10, y + 160)

        // Draw aura
        var grad = this.app.ctx.createRadialGradient(x + 100, y + 60, 0, x + 100, y + 60, 30)
        var c = this.systems[i].colorAura
        grad.addColorStop(0, 'rgba(' + c[0] + ','+ c[1] + ',' + c[2] + ',0.6)')
        grad.addColorStop(1, 'rgba(' + c[0] + ','+ c[1] + ',' + c[2] + ',0.0)')
        this.gfx.circle(x + 100, y + 60, 30, grad, 1, true)

        // Draw body
        c = this.systems[i].colorBody
        this.gfx.circle(x + 100, y + 60, 15, 'rgba(' + c[0] + ','+ c[1] + ',' + c[2] + ',1.0)', 1, true)

        // Draw inflow/outflow sockets
        this.gfx.circle(x + 30, y + 200, 15, "#ffffff", 2, false)
        this.gfx.circle(x + 80, y + 200, 15, "#ffffff", 2, false)
    }

    this.ctx.fillStyle = "#8080ff"
    this.ctx.strokeStyle = "#8080ff"
    this.ctx.lineWidth = 4

    // Draw current flow line
    if (this.isDrawingFlow) {
        this.ctx.beginPath()
        this.ctx.moveTo(this.flowSource.x + 80 + this.app.shiftX, this.flowSource.y + 200 + this.app.shiftY)
        this.ctx.lineTo(this.app.input.mousePos[0], this.app.input.mousePos[1])
        this.ctx.closePath()
        this.ctx.stroke()
    }

    // Draw existing flow lines
    for (var i = 0; i < this.flows.length; i++) {
        this.ctx.beginPath()
        this.ctx.moveTo(this.flows[i][0].x + 80 + this.app.shiftX, this.flows[i][0].y + 200 + this.app.shiftY)
        this.ctx.lineTo(this.flows[i][1].x + 30 + this.app.shiftX, this.flows[i][1].y + 200 + this.app.shiftY)
        this.ctx.closePath()
        this.ctx.stroke()
    }
}

StarSystems.prototype.handleMouseClick = function(ev) {
    for (var i = 0; i < this.nrOfSystems; i++) {
        var x = ev.layerX - this.app.shiftX
        var y = ev.layerY - this.app.shiftY

        if (this.isDrawingFlow) {
            var distance = Math.sqrt(
                (x - this.systems[i].x - 30) * (x - this.systems[i].x - 30)
                + (y - this.systems[i].y - 200) * (y - this.systems[i].y - 200)
            )

            if (distance <= 15 && this.systems[i].name != this.flowSource.name) {
                this.isDrawingFlow = false
                this.flows[this.flows.length] = [this.flowSource, this.systems[i]]
                this.flowSource = undefined
            }
        } else {
            var distance = Math.sqrt(
                (x - this.systems[i].x - 80) * (x - this.systems[i].x - 80)
                + (y - this.systems[i].y - 200) * (y - this.systems[i].y - 200)
            )

            if (distance <= 15) {
                this.isDrawingFlow = true
                this.flowSource = this.systems[i]
            }
        }
    }
}

StarSystems.prototype.checkFlowsForSystem = function(nr) {
    remainingFlux = this.systems[nr].resources.flux

    for (var i = 0; i < this.flows.length; i++) {
        if (this.flows[i][0].name == this.systems[nr].name) {
            var amTransfer = Math.min(1e4 / this.app.framerate, this.systems[nr].resources.am)
            remainingFlux -= Math.max(0, amTransfer * 5e2)
            this.systems[nr].resources.am -= amTransfer
            this.flows[i][1].resources.am += amTransfer
        }
    }

    return remainingFlux
}

StarSystems.prototype.update = function() {
    for (var i = 0; i < this.nrOfSystems; i++) {
        this.systems[i].resources.se -= this.systems[i].resources.flux * this.app.simSpeed / this.app.framerate
        this.systems[i].resources.flux = Math.max(0, this.systems[i].resources.se / 200 + 3e5)

        if (this.systems[i].resources.se <= 0) {
            this.systems[i].resources.se = 0
            this.systems[i].resources.flux = 0
        }

        remainingFlux = this.checkFlowsForSystem(i)

        if (this.systems[i].producesAM) {
            this.systems[i].resources.am += remainingFlux / 3e3
        }
    }
}