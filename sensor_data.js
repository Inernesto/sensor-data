let data = [];
let recording = false;
let sensorData = {}; // Declare sensorData object

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
            sensorData = {
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
                X: ${accelerometer.x.toFixed(2)}<br>
                Y: ${accelerometer.y.toFixed(2)}<br>
                Z: ${accelerometer.z.toFixed(2)}<br>
            `;
        });

        accelerometer.start();
        
        
        // Access gyroscope data
        let gyroscope = new Gyroscope({ frequency: 50 });

        gyroscope.addEventListener('reading', () => {
            // Read gyroscope data         
            sensorData["rotationRate.x"] = gyroscope.x;
            sensorData["rotationRate.y"] = gyroscope.y;
            sensorData["rotationRate.z"] = gyroscope.z;

            // Update HTML content with gyroscope data
            document.getElementById('gyroscope-data').innerHTML = `
                Gyroscope Data:<br>
                X: ${gyroscope.x.toFixed(2)}<br>
                Y: ${gyroscope.y.toFixed(2)}<br>
                Z: ${gyroscope.z.toFixed(2)}<br>
            `;
        });

        gyroscope.start();
        
        
        // Access absolute orientation sensor data
        let orientationSensor = new AbsoluteOrientationSensor({ frequency: 50 });

        orientationSensor.addEventListener('reading', () => {
            // Read orientation sensor data
            sensorData["attitude.roll"] = orientationSensor.quaternion[0];
            sensorData["attitude.pitch"] = orientationSensor.quaternion[1];
            sensorData["attitude.yaw"] = orientationSensor.quaternion[2];

            // Update HTML content with orientation sensor data
            document.getElementById('orientation-data').innerHTML = `
                Orientation Data:<br>
                Roll: ${orientationSensor.quaternion[0].toFixed(2)}<br>
                Pitch: ${orientationSensor.quaternion[1].toFixed(2)}<br>
                Yaw: ${orientationSensor.quaternion[2].toFixed(2)}<br>
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
