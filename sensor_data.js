let sensorData = [];
let startTime;
let currentTimeElement = document.getElementById('recordingTime');

function startSensors() {
    startTime = new Date();
    displayCurrentTime();
    if ('Accelerometer' in window && 'Gyroscope' in window && 'AbsoluteOrientationSensor' in window) {
        // Access accelerometer data
        let accelerometer = new Accelerometer({ frequency: 20 });
        accelerometer.addEventListener('reading', () => {
            let timestamp = new Date().toISOString();
            sensorData.push({
                timestamp: timestamp,
                "userAcceleration.x": accelerometer.x.toFixed(2),
                "userAcceleration.y": accelerometer.y.toFixed(2),
                "userAcceleration.z": accelerometer.z.toFixed(2)
            });
        });
        accelerometer.start();

        // Access gyroscope data
        let gyroscope = new Gyroscope({ frequency: 20 });
        gyroscope.addEventListener('reading', () => {
            sensorData[sensorData.length - 1]["rotationRate.x"] = gyroscope.x.toFixed(2);
            sensorData[sensorData.length - 1]["rotationRate.y"] = gyroscope.y.toFixed(2);
            sensorData[sensorData.length - 1]["rotationRate.z"] = gyroscope.z.toFixed(2);
        });
        gyroscope.start();

        // Access absolute orientation sensor data
        let orientationSensor = new AbsoluteOrientationSensor({ frequency: 20 });
        orientationSensor.addEventListener('reading', () => {
            sensorData[sensorData.length - 1]["attitude.roll"] = orientationSensor.quaternion[0].toFixed(2);
            sensorData[sensorData.length - 1]["attitude.pitch"] = orientationSensor.quaternion[1].toFixed(2);
            sensorData[sensorData.length - 1]["attitude.yaw"] = orientationSensor.quaternion[2].toFixed(2);
        });
        orientationSensor.start();
    } else {
        console.error('Sensors not supported in this browser');
    }
}

function displayCurrentTime() {
    let currentTime = new Date();
    currentTimeElement.textContent = 'Recording Time: ' + currentTime.toLocaleString();
    setTimeout(displayCurrentTime, 1000); // Update every second
}

function stopSensors() {
    let stopTime = new Date().toISOString();
    sensorData.push({ timestamp: stopTime, action: 'Stopped' });
}

function downloadSensorData() {
    const jsonData = JSON.stringify(sensorData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sensor_data.json';
    a.click();
    URL.revokeObjectURL(url);
}
