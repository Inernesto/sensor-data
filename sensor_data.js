if ('Accelerometer' in window && 'Gyroscope' in window && 'AbsoluteOrientationSensor' in window) {
    // Request permission to access sensors
    navigator.permissions.query({ name: 'accelerometer' }).then(result => {
        if (result.state === 'granted') {
            // Access accelerometer data
            let accelerometer = new Accelerometer({ frequency: 20 });

            accelerometer.addEventListener('reading', () => {
                // Read accelerometer data
                let accelerationX = accelerometer.x;
                let accelerationY = accelerometer.y;
                let accelerationZ = accelerometer.z;

                // Update HTML content with accelerometer data
                document.getElementById('accelerometer-data').innerHTML = `
                    Accelerometer Data:<br>
                    X: ${accelerationX.toFixed(2)}<br>
                    Y: ${accelerationY.toFixed(2)}<br>
                    Z: ${accelerationZ.toFixed(2)}<br>
                `;
            });

            accelerometer.start();
        } else {
            console.error('Permission to access accelerometer denied');
        }
    }).catch(error => {
        console.error('Error accessing accelerometer:', error);
    });

    // Access gyroscope data
    let gyroscope = new Gyroscope({ frequency: 20 });

    gyroscope.addEventListener('reading', () => {
        // Read gyroscope data
        let rotationRateX = gyroscope.x;
        let rotationRateY = gyroscope.y;
        let rotationRateZ = gyroscope.z;

        // Update HTML content with gyroscope data
        document.getElementById('gyroscope-data').innerHTML = `
            Gyroscope Data:<br>
            X: ${rotationRateX.toFixed(2)}<br>
            Y: ${rotationRateY.toFixed(2)}<br>
            Z: ${rotationRateZ.toFixed(2)}<br>
        `;
    });

    gyroscope.start();

    // Access absolute orientation sensor data
    let orientationSensor = new AbsoluteOrientationSensor({ frequency: 20 });

    orientationSensor.addEventListener('reading', () => {
        // Read orientation sensor data
        let attitudeRoll = orientationSensor.quaternion[0];
        let attitudePitch = orientationSensor.quaternion[1];
        let attitudeYaw = orientationSensor.quaternion[2];

        // Update HTML content with orientation sensor data
        document.getElementById('orientation-data').innerHTML = `
            Orientation Data:<br>
            Roll: ${attitudeRoll.toFixed(2)}<br>
            Pitch: ${attitudePitch.toFixed(2)}<br>
            Yaw: ${attitudeYaw.toFixed(2)}<br>
        `;
    });

    orientationSensor.start();

    // Constants
    const alpha = 0.8; // Low-pass filter constant
    let gravityX = 0;
    let gravityY = 0;
    let gravityZ = 0;

    // Access accelerometer data
    let accelerometerLPF = new Accelerometer({ frequency: 20 });

    accelerometerLPF.addEventListener('reading', () => {
        // Read accelerometer data
        let rawAccelerationX = accelerometerLPF.x;
        let rawAccelerationY = accelerometerLPF.y;
        let rawAccelerationZ = accelerometerLPF.z;

        // Apply low-pass filter to isolate gravity
        gravityX = alpha * gravityX + (1 - alpha) * rawAccelerationX;
        gravityY = alpha * gravityY + (1 - alpha) * rawAccelerationY;
        gravityZ = alpha * gravityZ + (1 - alpha) * rawAccelerationZ;

        // Subtract gravity from raw acceleration to obtain motion acceleration
        let motionAccelerationX = rawAccelerationX - gravityX;
        let motionAccelerationY = rawAccelerationY - gravityY;
        let motionAccelerationZ = rawAccelerationZ - gravityZ;

        // Update HTML content with motion acceleration data
        document.getElementById('motion-acceleration-data').innerHTML = `
            Motion Acceleration Data:<br>
            X: ${motionAccelerationX.toFixed(2)}<br>
            Y: ${motionAccelerationY.toFixed(2)}<br>
            Z: ${motionAccelerationZ.toFixed(2)}<br>
        `;
    });

    accelerometerLPF.start();

} else {
    console.error('Sensors not supported in this browser');
}
