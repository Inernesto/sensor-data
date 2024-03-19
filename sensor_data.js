let recordingTimeElement = document.getElementById('recordingTime');

// Start button
document.getElementById('startButton').addEventListener('click', () => {
    // Clear previous data
    sensorData = [];

    // Start recording time
    let startTime = new Date().getTime();

    // Start sensor readings
    if ('Accelerometer' in window && 'Gyroscope' in window && 'AbsoluteOrientationSensor' in window) {
		
        // Access accelerometer data
		
        // Constants
        const alpha = 0.8; // Low-pass filter constant
        let gravityX = 0;
        let gravityY = 0;
        let gravityZ = 0;
		
        let accelerometer = new Accelerometer({ frequency: 50 });

        accelerometer.addEventListener('reading', () => {
            // Read accelerometer data
            let rawAccelerationX = accelerometer.x;
            let rawAccelerationY = accelerometer.y;
            let rawAccelerationZ = accelerometer.z;
			
			// Apply low-pass filter to isolate gravity
            gravityX = alpha * gravityX + (1 - alpha) * rawAccelerationX;
            gravityY = alpha * gravityY + (1 - alpha) * rawAccelerationY;
            gravityZ = alpha * gravityZ + (1 - alpha) * rawAccelerationZ;
			
			// Subtract gravity from raw acceleration to obtain motion acceleration
            let userAccelerationX = rawAccelerationX - gravityX;
            let userAccelerationY = rawAccelerationY - gravityY;
            let userAccelerationZ = rawAccelerationZ - gravityZ;

            // Update HTML content with accelerometer data
            document.getElementById('accelerometer-data').innerHTML = `
                User Accelerometer Data:<br>
                X: ${userAccelerationX.toFixed(2)}<br>
                Y: ${userAccelerationY.toFixed(2)}<br>
                Z: ${userAccelerationZ.toFixed(2)}<br>
            `;
			
            // Update HTML content with motion acceleration data
            document.getElementById('gravity-data').innerHTML = `
                Motion Acceleration Data:<br>
                X: ${gravityX.toFixed(2)}<br>
                Y: ${gravityY.toFixed(2)}<br>
                Z: ${gravityZ.toFixed(2)}<br>
            `;

            // Store sensor readings in data array
            sensorData.push({
                index: sensorData.length,
                'userAcceleration.x': userAccelerationX,
                'userAcceleration.y': userAccelerationY,
                'userAcceleration.z': userAccelerationZ,
				'gravity.x': gravityX,
				'gravity.y': gravityY,
				'gravity.z': gravityZ,
            });
        });

        accelerometer.start();


        // Access gyroscope data
        let gyroscope = new Gyroscope({ frequency: 50 });

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
			
			
			sensorData[sensorData.length - 1]["rotationRate.x"] = rotationRateX;
            sensorData[sensorData.length - 1]["rotationRate.y"] = rotationRateY;
            sensorData[sensorData.length - 1]["rotationRate.z"] = rotationRateZ;
        });

        gyroscope.start();
		

        // Access absolute orientation sensor data
        let orientationSensor = new AbsoluteOrientationSensor({ frequency: 50 });

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
			
			
			sensorData[sensorData.length - 1]["attitude.roll"] = attitudeRoll;
            sensorData[sensorData.length - 1]["attitude.pitch"] = attitudePitch;
            sensorData[sensorData.length - 1]["attitude.yaw"] = attitudeYaw;
        });

        orientationSensor.start();

    } else {
        console.error('Sensors not supported in this browser');
    }
});


function displayCurrentTime() {
    let currentTime = new Date();
    recordingTimeElement.textContent = 'Recording Time: ' + currentTime.toLocaleString();
    setTimeout(displayCurrentTime, 1000); // Update every second
}


// Stop button
document.getElementById('stopButton').addEventListener('click', () => {
    // Stop sensor readings
    // Download data as JSON file
    downloadData();
});

// Function to download data as JSON file
function downloadData() {
    let jsonData = JSON.stringify(data);
    let blob = new Blob([jsonData], { type: 'application/json' });
    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = url;
    a.download = 'sensor_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
