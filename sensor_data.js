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
    document.getElementById('sensor-data').innerHTML = '';
    document.getElementById('recording-time').innerHTML = '';
}

function displayCurrentTime() {
    let currentTime = new Date();
    document.getElementById('recording-time').textContent = 'Recording Time: ' + currentTime.toLocaleString();
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
	displayCurrentTime();

	if ('Accelerometer' in window && 'Gyroscope' in window && 'AbsoluteOrientationSensor' in window) {
		// Request permission to access sensors
		navigator.permissions.query({ name: 'accelerometer' }).then(result => {
			if (result.state === 'granted') {
				// Access accelerometer data
				let accelerometer = new Accelerometer({ frequency: 20 });

				accelerometer.addEventListener('reading', () => {
					// Read accelerometer data
					let sensorData = {
						index: data.length,
						// 'userAcceleration.x': accelerometer.x,
						// 'userAcceleration.y': accelerometer.y,
						// 'userAcceleration.z': accelerometer.z,
						'acceleration.x': accelerometer.x,
						'acceleration.y': accelerometer.y,
						'acceleration.z': accelerometer.z,
						'gravity.x': accelerometer.gravity.x,
						'gravity.y': accelerometer.gravity.y,
						'gravity.z': accelerometer.gravity.z
					};
					
					// Read accelerometer and gravity data
					let accelerationX = accelerometer.x;
					let accelerationY = accelerometer.y;
					let accelerationZ = accelerometer.z;
					let gravityX = accelerometer.gravity.x;
					let gravityY = accelerometer.gravity.y;
					let gravityZ = accelerometer.gravity.z;
					
					// Update HTML content with accelerometer data
					document.getElementById('accelerometer-data').innerHTML = `
						User Accelerometer Data:<br>
						X: ${accelerationX.toFixed(2)}<br>
						Y: ${accelerationY.toFixed(2)}<br>
						Z: ${accelerationZ.toFixed(2)}<br>
					`;
					
					// Update HTML content with motion acceleration data
					document.getElementById('gravity-data').innerHTML = `
						Gravity Data:<br>
						X: ${gravityX.toFixed(2)}<br>
						Y: ${gravityY.toFixed(2)}<br>
						Z: ${gravityZ.toFixed(2)}<br>
					`;
					
					
					// Add to the sensor data
					if ('RotationRateSensor' in window) {
						let rotationRateSensor = new RotationRateSensor({ frequency: 20 });
						sensorData['rotationRate.x'] = rotationRateSensor.x;
						sensorData['rotationRate.y'] = rotationRateSensor.y;
						sensorData['rotationRate.z'] = rotationRateSensor.z;
						rotationRateSensor.start();
					}
					
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
					
					
					// Add to the sensor data
					if ('AbsoluteOrientationSensor' in window) {
						let orientationSensor = new AbsoluteOrientationSensor({ frequency: 20 });
						sensorData['attitude.roll'] = orientationSensor.quaternion[0];
						sensorData['attitude.pitch'] = orientationSensor.quaternion[1];
						sensorData['attitude.yaw'] = orientationSensor.quaternion[2];
						orientationSensor.start();
					}
					
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
					
					
					// Update HTML content with sensor data
					let sensorDataElement = document.getElementById('sensor-data');
					sensorDataElement.textContent = JSON.stringify(sensorData, null, 2);

					if (recording) {
						data.push(sensorData);
					}
				});

				accelerometer.start();
			} else {
				console.error('Permission to access accelerometer denied');
			}
		}).catch(error => {
			console.error('Error accessing accelerometer:', error);
		});
	} else {
		console.error('Sensors not supported in this browser');
	}
	
});


// Stop button
document.getElementById('stopButton').addEventListener('click', () => {
	stopRecording()
	
    // Clear sensor data display
    // document.getElementById('accelerometer-data').innerHTML = '';
    // document.getElementById('gyroscope-data').innerHTML = '';
    // document.getElementById('orientation-data').innerHTML = '';
    // document.getElementById('gravity-data').innerHTML = '';

    // Clear recording time display
    // recordingTimeElement.textContent = '';

    // Stop sensor readings
    // Download data as JSON file
	
    // downloadData();
});
