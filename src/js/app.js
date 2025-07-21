document.addEventListener('DOMContentLoaded', () => {
    const ipInput = document.getElementById('ipInput');
    const trackButton = document.getElementById('trackButton');
    const resultDiv = document.getElementById('result');
    const mapDiv = document.getElementById('map');
    const glassPanel = document.querySelector('.glass-panel');
    
    let map = null;

    // Cool animation on load
    glassPanel.style.opacity = 0;
    glassPanel.style.transform = 'scale(0.95) translateY(40px)';
    setTimeout(() => {
        glassPanel.style.transition = 'opacity 0.8s cubic-bezier(.77,0,.18,1), transform 0.8s cubic-bezier(.77,0,.18,1)';
        glassPanel.style.opacity = 1;
        glassPanel.style.transform = 'scale(1) translateY(0)';
    }, 100);

    function initMap(lat, lng) {
        if (map) {
            map.remove();
        }
        mapDiv.style.display = 'block';
        map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);
        L.marker([lat, lng]).addTo(map);
    }

    trackButton.addEventListener('click', async () => {
        const ip = ipInput.value.trim();
        
        if (!ip) {
            alert('Please enter an IP address');
            return;
        }

        try {
            trackButton.disabled = true;
            trackButton.innerHTML = '<span class="button-text">Scanning...</span>';
            
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.reason || 'Invalid IP address');
            }

            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <h3>[ TARGET LOCATION IDENTIFIED ]</h3>
                <div class="result-grid">
                    <p><span class="label">TARGET IP:</span> <span class="value">${data.ip}</span></p>
                    <p><span class="label">LOCATION:</span> <span class="value">${data.city}, ${data.region}</span></p>
                    <p><span class="label">COUNTRY:</span> <span class="value">${data.country_name}</span></p>
                    <p><span class="label">ISP:</span> <span class="value">${data.org}</span></p>
                    <p><span class="label">LAT:</span> <span class="value">${data.latitude}</span></p>
                    <p><span class="label">LONG:</span> <span class="value">${data.longitude}</span></p>
                    <p><span class="label">TIMEZONE:</span> <span class="value">${data.timezone}</span></p>
                </div>
            `;
            initMap(data.latitude, data.longitude);

        } catch (error) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <h3>[ ERROR DETECTED ]</h3>
                <p class="error-message">${error.message}</p>
            `;
            mapDiv.style.display = 'none';
        } finally {
            trackButton.disabled = false;
            trackButton.innerHTML = `
                <span class="button-text">SCAN</span>
                <span class="button-icon">⌖</span>
            `;
        }
    });
});