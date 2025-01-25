// Traffic Light Simulation
function startSimulation() {
    const lights = document.querySelectorAll('.light');
    let currentIndex = 0;

    // Function to update the active light
    function updateLight() {
        lights.forEach((light, index) => {
            light.classList.remove('active');
            if (index === currentIndex) {
                light.classList.add('active');
            }
        });
        currentIndex = (currentIndex + 1) % lights.length; // Cycle through lights
    }

    // Start the simulation (change light every 1 second)
    setInterval(updateLight, 1000);
}

