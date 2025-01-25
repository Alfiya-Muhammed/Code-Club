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
    lights.forEach(light => light.classList.remove('active'));
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

    if (location === '') {
        alert('Please enter a location to start the simulation.');
        return;
    }

    currentLight = 'red';
    timerValue = timers[currentLight];
    setActiveLight(currentLight);
    updateTimers();
    document.querySelector('button[onclick="pedestrianRequest()"]').disabled = false; // Enable pedestrian button
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
function emergencyOverride() {
    if (!interval) {
        alert('Start the simulation first.');
        return;
    }

    clearInterval(interval);
    emergencyActive = true;

    // Display the emergency message
    document.getElementById('emergency-message').classList.remove('hidden');

    // Disable pedestrian button
    document.querySelector('button[onclick="pedestrianRequest()"]').disabled = true;

    // Immediately switch to green light for emergency vehicles
    currentLight = 'green';
    timerValue = timers.green;
    setActiveLight(currentLight);

    // After the green light for the emergency ends, switch to red
    setTimeout(() => {
        emergencyActive = false; // End emergency mode
        document.getElementById('emergency-message').classList.add('hidden'); // Hide emergency message

        // Resume red light and normal sequence
        currentLight = 'red';
        timerValue = timers.red;
        setActiveLight(currentLight);
        updateTimers();

        // Enable pedestrian button after emergency
        document.querySelector('button[onclick="pedestrianRequest()"]').disabled = false;
    }, timers.green * 1000); // Wait for the green light duration
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
    lights.forEach(light => light.classList.remove('active'));

    document.getElementById('red-timer').innerText = `10s`;
    document.getElementById('yellow-timer').innerText = `5s`;
    document.getElementById('green-timer').innerText = `15s`;

    // Clear the location input
    document.getElementById('location').value = '';

    // Disable the pedestrian button
    document.querySelector('button[onclick="pedestrianRequest()"]').disabled = true;

    //alert('Simulation stopped and reset.');
}
