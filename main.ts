const IR_PIN = AnalogPin.C17; // const for the PIN

let ir_sensor_data_raw = 0;
let max_ir_value = 1010; // my max value
const leds_in_row = 5; 

let pixel_step = max_ir_value / leds_in_row;

let ir_sensor_data = 0; // just the simplified data from the IR sensor

let mode = "number"; // mode for displaying the data from the IR sensor

let driving = false;

const BASE_SPEED = 20; // base speed 

const motorA = Motor.M0; // easer typing
const motorB = Motor.M1; // easer typing
const motorAB = Motor.M0_M1; // easer typing



// Button A
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    mode = "number";
});

// Button B
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    mode = "diagramm";
});

// Button AB
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    driving = !driving;
});



// function for driving mechanics
function drive() {
    if (ir_sensor_data >= 2) {
        motors.dualMotorPower(motorB, 100);
        motors.dualMotorPower(motorA, BASE_SPEED);
    } else {
        motors.dualMotorPower(motorA, 100);
        motors.dualMotorPower(motorB, BASE_SPEED);
    }
}



// mainloop
basic.forever(function () {
    
    // ----------IR-Section----------
    ir_sensor_data_raw = pins.analogReadPin(IR_PIN); // read IR sensor data

    ir_sensor_data = 0; // reset simplified data

    if (driving) {
        basic.setLedColor(Colors.Green);
    } else {
        basic.setLedColor(Colors.Red);
    }

    for (let pixel = 0; pixel < 5; pixel++) {

        if (ir_sensor_data_raw > pixel_step * pixel) {

            if (mode == "diagramm") {
                for (let i = 0; i < 5; i++) {
                    led.plot(i, pixel);
                }
            }

            ir_sensor_data = pixel;

        } else {

            if (mode == "diagramm") {
                for (let j = 0; j < 5; j++) {
                    led.unplot(j, pixel);
                }
            }
        }
    }

    if (mode == "number") {
        basic.showNumber(ir_sensor_data);
    }


    // ----------Motor-Section----------
    if (driving) {
        drive();
    } else {
        motors.dualMotorPower(motorAB, 0)
    }

    basic.pause(1);
});