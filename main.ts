input.onButtonPressed(Button.A, function () {
    Heartrate += 50
})
input.onButtonPressed(Button.B, function () {
    Heartrate += -50
})
radio.onReceivedValue(function (name, value) {
    anxiety = value
    if (anxiety == 1) {
        basic.showLeds(`
            . # . # .
            # # # # #
            # # # # #
            . # # # .
            . . # . .
            `)
    } else {
        basic.showLeds(`
            . . . . .
            . # . # .
            . . . . .
            # . . . #
            . # # # .
            `)
    }
})
let bpm = 0
let elapsedSeconds = 0
let heartbeats = 0
let gateOpen = false
let signalValue = 0
let anxiety = 0
let Heartrate = 60
let start_time = input.runningTime()
let gateThreshold = 500
anxiety = 0
radio.setGroup(10)
radio.setTransmitPower(7)
basic.forever(function () {
    //Radio
    radio.sendString("1")
    radio.sendNumber(Heartrate)
    basic.pause(100)
    //Heartrate
    // Read the analog value from pin 2
    signalValue = pins.analogReadPin(AnalogPin.P2)
    // Check if the signal value exceeds the gate threshold
    if (signalValue > gateThreshold && !(gateOpen)) {
        gateOpen = true
        heartbeats += 1
        // Play a middle C tone
        music.playTone(262, music.beat(BeatFraction.Whole))
        basic.showIcon(IconNames.Heart)
        led.setBrightness(125)
    } else if (signalValue <= gateThreshold && gateOpen) {
        gateOpen = false
        music.stopAllSounds()
        led.setBrightness(0)
    }
    // Calculate elapsed time
    elapsedSeconds = (input.runningTime() - start_time) / 1000
    // Update BPM every 10 seconds (adjust as needed)
    if (elapsedSeconds >= 10) {
        bpm = Math.round(2 * (heartbeats / (elapsedSeconds / 60)))
        serial.writeValue("BPM", bpm)
        start_time = input.runningTime()
        heartbeats = 0
    }
})
