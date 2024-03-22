let data = [];
let recording = false;

function startRecording() {
    data = [];
    recording = true;
    displayCurrentTime();
}

function stopRecording() {
    recording = false;
    downloadData();
    
    // Clear sensor data display
    document.getElementById('accelerometer-data').innerHTML = '';
    document.getElementById('gyroscope-data').innerHTML = '';
    document.getElementById('orientation-data').innerHTML = '';
    document.getElementById('gravity-data').innerHTML = '';
    
    // Clear recording time display
    document.getElementById('recording-time').innerHTML = '';
}

function displayCurrentTime() {
    let currentTime = new Date();
    document.getElementById('recording-time').innerHTML = 'Recording Time: ' + currentTime.toLocaleString();
    if (recording) {
        setTimeout(displayCurrentTime, 1000); // Update every second
    }
}

function downloadData() {
    let jsonData = JSON.stringify(data, null, 2);
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

// Start button
document.getElementById('startButton').addEventListener('click', () => {
    startRecording();

    if ('Accelerometer' in window && 'Gyroscope' in window && 'AbsoluteOrientationSensor' in window) {
        // Access accelerometer data
        let accelerometer = new Accelerometer({ frequency: 50 });

        accelerometer.addEventListener('reading', () => {
            // Read accelerometer data
            let sensorData = {
                index: data.length,
                'acceleration.x': accelerometer.x,
                'acceleration.y': accelerometer.y,
                'acceleration.z': accelerometer.z
            };

            // Add to the sensor data
            if (recording) {
                data.push(sensorData);
            }

            // Update HTML content with accelerometer data
            document.getElementById('accelerometer-data').innerHTML = `
                Accelerometer Data:<br>
                X: ${sensorData['acceleration.x'].toFixed(2)}<br>
                Y: ${sensorData['acceleration.y'].toFixed(2)}<br>
                Z: ${sensorData['acceleration.z'].toFixed(2)}<br>
            `;
        });

        accelerometer.start();
		
		
		// Access gyroscope data
        let gyroscope = new Gyroscope({ frequency: 50 });

        gyroscope.addEventListener('reading', () => {
            // Read gyroscope data
            let sensorData = {
                index: data.length,
                'rotationRate.x': gyroscope.x,
                'rotationRate.y': gyroscope.y,
                'rotationRate.z': gyroscope.z
            };

            // Add to the sensor data
            if (recording) {
                data.push(sensorData);
            }

            // Update HTML content with gyroscope data
            document.getElementById('gyroscope-data').innerHTML = `
                Gyroscope Data:<br>
                X: ${sensorData['rotationRate.x'].toFixed(2)}<br>
                Y: ${sensorData['rotationRate.y'].toFixed(2)}<br>
                Z: ${sensorData['rotationRate.z'].toFixed(2)}<br>
            `;
        });

        gyroscope.start();
		
		
		// Access absolute orientation sensor data
        let orientationSensor = new AbsoluteOrientationSensor({ frequency: 50 });

        orientationSensor.addEventListener('reading', () => {
            // Read orientation sensor data
            let sensorData = {
                index: data.length,
                'attitude.roll': orientationSensor.quaternion[0],
                'attitude.pitch': orientationSensor.quaternion[1],
                'attitude.yaw': orientationSensor.quaternion[2]
            };

            // Add to the sensor data
            if (recording) {
                data.push(sensorData);
            }

            // Update HTML content with orientation sensor data
            document.getElementById('orientation-data').innerHTML = `
                Orientation Data:<br>
                Roll: ${sensorData['attitude.roll'].toFixed(2)}<br>
                Pitch: ${sensorData['attitude.pitch'].toFixed(2)}<br>
                Yaw: ${sensorData['attitude.yaw'].toFixed(2)}<br>
            `;
        });

        orientationSensor.start();
		
		
    } else {
        console.error('Sensors not supported in this browser');
    }
});

// Stop button
document.getElementById('stopButton').addEventListener('click', () => {
    stopRecording();
});
