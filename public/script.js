let currentLight = 'red';
let timers = {
    red: 10,
    yellow: 5,
    green: 15
};
let timerValue = timers[currentLight];
let interval;
let pedestrianWaiting = false;
let emergencyActive = false;

// Function to update the active light
function updateLight() {
    if (emergencyActive) return; // Skip normal updates during an emergency

    // Reset the current light's timer
    if (currentLight === 'red') {
        currentLight = 'green';
    } else if (currentLight === 'green') {
        currentLight = 'yellow';
    } else {
        currentLight = 'red';
    }

    timerValue = timers[currentLight];
    setActiveLight(currentLight);
}

// Function to set the active light and update the UI
function setActiveLight(light) {
    const lights = document.querySelectorAll('.light');
    lights.forEach((l) => l.classList.remove('active'));
    document.querySelector(`.${light}`).classList.add('active');

    updateTimers();
}

// Function to update the timers
function updateTimers() {
    clearInterval(interval);

    interval = setInterval(() => {
        if (timerValue > 0) {
            timerValue--;
            document.getElementById(`${currentLight}-timer`).innerText = `${timerValue}s`;
        } else {
            clearInterval(interval);
            if (pedestrianWaiting && currentLight === 'red') {
                pedestrianWaiting = false; // Reset pedestrian flag after red light
            }
            updateLight();
        }
    }, 1000);
}

// Function to start the simulation
function startSimulation() {
    const location = document.getElementById('location').value.trim();

    if (!location) {
        alert('Please enter a location to start the simulation.');
        return;
    }

    // Send location to backend
    fetch('/api/location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location })
    })
        .then((response) => response.json())
        .then((data) => console.log(data.message))
        .catch((error) => console.error('Error:', error));

    currentLight = 'red';
    timerValue = timers[currentLight];
    setActiveLight(currentLight);
    updateTimers();

    // Enable pedestrian button
    document.querySelector('button[onclick="pedestrianRequest()"]').disabled = false;

    // Start listening for emergencies
    listenForEmergencies();
}

// Function to handle pedestrian crossing requests
function pedestrianRequest() {
    if (emergencyActive) {
        alert('Pedestrian crossing is disabled during an emergency!');
        return;
    }

    if (!interval) {
        alert('Start the simulation first.');
        return;
    }

    if (currentLight !== 'red') {
        alert('Pedestrian requested! Switching to red light for crossing.');
        currentLight = 'red';
        timerValue = timers.red; // Reset the timer for red
        setActiveLight(currentLight);
        pedestrianWaiting = true;
    } else {
        alert('It is already red. Pedestrians can cross.');
    }
}

// Function to handle emergency vehicle override
function handleEmergency(location) {
    if (!interval) {
        alert('Start the simulation first.');
        return;
    }

    console.log(`Emergency vehicle reported at: ${location}`);
    clearInterval(interval);
    emergencyActive = true;

    // Display emergency message
    const emergencyMessage = document.getElementById('emergency-message');
    emergencyMessage.textContent = `Emergency vehicle at "${location}". Switching lights for priority.`;
    emergencyMessage.classList.remove('hidden');

    // Immediately switch to green light
    currentLight = 'green';
    timerValue = timers.green;
    setActiveLight(currentLight);

    // Resume normal operations after emergency duration
    setTimeout(() => {
        emergencyActive = false;
        emergencyMessage.classList.add('hidden');

        // Resume red light and normal sequence
        currentLight = 'red';
        timerValue = timers.red;
        setActiveLight(currentLight);
        updateTimers();
    }, timers.green * 1000); // Simulate green light duration for emergency
}

// Function to simulate listening for emergency events
function listenForEmergencies() {
    console.log('Listening for emergency events...');

    // Simulate receiving an emergency event after some time
    setTimeout(() => {
        const simulatedLocation = 'Main Street';
        handleEmergency(simulatedLocation);
    }, 15000); // Simulate an emergency event after 15 seconds
}

// Function to stop the simulation
function stopSimulation() {
    clearInterval(interval);
    interval = null; // Clear the interval
    emergencyActive = false;

    // Hide the emergency message
    document.getElementById('emergency-message').classList.add('hidden');

    // Reset all lights and timers
    const lights = document.querySelectorAll('.light');
    lights.forEach((light) => light.classList.remove('active'));

    document.getElementById('red-timer').innerText = `10s`;
    document.getElementById('yellow-timer').innerText = `5s`;
    document.getElementById('green-timer').innerText = `15s`;

    // Clear the location input
    document.getElementById('location').value = '';

    // Disable the pedestrian button
    document.querySelector('button[onclick="pedestrianRequest()"]').disabled = true;

    //alert('Simulation stopped and reset.');
}
