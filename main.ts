const IR_PIN = AnalogPin.C17; // const for the PIN
const motorA = Motor.M0; // easier typing
const motorB = Motor.M1; // easier typing
const motorAB = Motor.M0_M1; // easier typing

const BASE_SPEED = 50; // base speed 
const max_ir_value = 1010; // my max value
const leds_in_row = 5;
const driveThreshold = 300;

let lastVals: number[] = [];

lastVals.fill(0, 0, 4);

let ir_sensor_data_raw = 0;

let driving = false;

// function for driving mechanics
function drive(data: number) {
    if (data >= driveThreshold) {
        motors.dualMotorPower(motorB, 100);
        motors.dualMotorPower(motorA, BASE_SPEED);
    } else {
        motors.dualMotorPower(motorA, 100);
        motors.dualMotorPower(motorB, BASE_SPEED);
    }
}

// Button B
input.onButtonEvent(Button.B, input.buttonEventClick(), () => driving = false);

// Button AB
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    driving = true;

    while (driving) {

        // ----------IR-Section----------
        ir_sensor_data_raw = pins.analogReadPin(IR_PIN); // read IR sensor data

        // ----------Motor-Section----------
        drive(ir_sensor_data_raw);

        basic.pause(1);
    }
});

// mainloop
basic.forever(() => {
    if (driving) {
        basic.setLedColor(Colors.Green);
    } else {
        basic.setLedColor(Colors.Red);
        motors.dualMotorPower(motorAB, 0);
    }

    for (let j = leds_in_row; j > 0; j--) {
        lastVals[j] = lastVals[j-1];
    }

    lastVals[0] = pins.analogReadPin(IR_PIN);

    for (let x = 0; x < leds_in_row; x++) {
        let tmpVal = (lastVals[x] / max_ir_value) * 5;

        for (let y = 0; y < leds_in_row; y++) {
            if (y <= tmpVal) led.plot(x, y);
            else led.unplot(x, y);
        }
    }

    basic.pause(1000);
});