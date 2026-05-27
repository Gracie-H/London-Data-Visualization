let myBubbleChart = null; 

function showPage(pageNum) {
    const p1 = document.getElementById('simple-page-1');
    const p3 = document.getElementById('simple-page-3');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-page1`).classList.toggle('active', pageNum === 1);
    document.getElementById(`tab-page2`).classList.toggle('active', pageNum === 2);
    document.getElementById(`tab-page3`).classList.toggle('active', pageNum === 3);

    if (pageNum === 1) {
        p1.style.display = 'flex';
        p3.style.display = 'none';
    } else if (pageNum === 2) {
        p1.style.display = 'none';
        p3.style.display = 'none';
        if (map) setTimeout(() => map.resize(), 50);
    } else if (pageNum === 3) {
        p1.style.display = 'none';
        p3.style.display = 'flex';
        if (myBubbleChart) setTimeout(() => myBubbleChart.resize(), 50);
    }
}


const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3JhY2NlZSIsImEiOiJjbW84bml2aDcwMGRoMnJyN3IyYjM3YmdxIn0.gnpai_1oKDMZtuGhgxTiTQ';
mapboxgl.accessToken = MAPBOX_TOKEN;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11', 
    center: [-0.1276, 51.5074],
    zoom: 10
});

// 2026 TfL Annual Travelcard 
const FARE_DATA = {
    london: { 1: 1628, 2: 1628, 3: 1916, 4: 2340, 5: 2784, 6: 2976 },
    newYork: 1560 
};

const LONDON_CENTER = [-0.1276, 51.5074]; 

const TUBE_NETWORK_DATABASE = [
    // ZONE 1 
    { name: "Waterloo", zone: 1, lat: 51.5033, lon: -0.1147, postcode: "SE1 8SW" },
    { name: "Oxford Circus", zone: 1, lat: 51.5152, lon: -0.1419, postcode: "W1B 3AG" },
    { name: "London Bridge", zone: 1, lat: 51.5050, lon: -0.0860, postcode: "SE1 9SP" },
    { name: "King's Cross St. Pancras", zone: 1, lat: 51.5308, lon: -0.1238, postcode: "N1 9AL" },
    { name: "Westminster", zone: 1, lat: 51.5014, lon: -0.1249, postcode: "SW1A 2JR" },
    { name: "Liverpool Street", zone: 1, lat: 51.5178, lon: -0.0820, postcode: "EC2M 7PY" },
    { name: "Victoria", zone: 1, lat: 51.4965, lon: -0.1447, postcode: "SW1V 1JU" },
    { name: "Paddington", zone: 1, lat: 51.5168, lon: -0.1756, postcode: "W2 1HB" },

    // ZONE 2 
    { name: "Camden Town", zone: 2, lat: 51.5392, lon: -0.1426, postcode: "NW1 8QL" },
    { name: "Brixton", zone: 2, lat: 51.4626, lon: -0.1149, postcode: "SW9 8JX" },
    { name: "Finsbury Park", zone: 2, lat: 51.5642, lon: -0.1064, postcode: "N4 2DH" },
    { name: "Hammersmith", zone: 2, lat: 51.4929, lon: -0.2229, postcode: "W6 7TE" },
    { name: "Canary Wharf", zone: 2, lat: 51.5048, lon: -0.0195, postcode: "E14 5NY" },
    { name: "Elephant & Castle", zone: 2, lat: 51.4945, lon: -0.1006, postcode: "SE1 6LW" },
    { name: "Whitechapel", zone: 2, lat: 51.5194, lon: -0.0612, postcode: "E1 1BY" },

    // ZONE 3 
    { name: "Stratford", zone: 3, lat: 51.5417, lon: -0.0031, postcode: "E15 1AZ" },
    { name: "Wimbledon", zone: 3, lat: 51.4214, lon: -0.2063, postcode: "SW19 7NL" },
    { name: "Highgate", zone: 3, lat: 51.5775, lon: -0.1469, postcode: "N6 5UA" },
    { name: "Ealing Broadway", zone: 3, lat: 51.5150, lon: -0.3015, postcode: "W5 2NU" },
    { name: "Tooting Broadway", zone: 3, lat: 51.4275, lon: -0.1681, postcode: "SW17 0SU" },
    { name: "Canning Town", zone: 3, lat: 51.5138, lon: 0.0081, postcode: "E16 1DQ" },
    { name: "Greenwich", zone: 3, lat: 51.4781, lon: -0.0148, postcode: "SE10 8JQ" },

    // ZONE 4 
    { name: "Wembley Park", zone: 4, lat: 51.5632, lon: -0.2797, postcode: "HA9 9AA" },
    { name: "Richmond", zone: 4, lat: 51.4632, lon: -0.3015, postcode: "TW9 1EZ" },
    { name: "Barking", zone: 4, lat: 51.5394, lon: 0.0810, postcode: "IG11 8TU" },
    { name: "Morden", zone: 4, lat: 51.4023, lon: -0.1941, postcode: "SM4 5AZ" },
    { name: "Golders Green", zone: 4, lat: 51.5724, lon: -0.1993, postcode: "NW11 7RN" },
    { name: "Wood Green", zone: 4, lat: 51.5975, lon: -0.1097, postcode: "N22 8HH" },

    // ZONE 5 
    { name: "Harrow-on-the-Hill", zone: 5, lat: 51.5794, lon: -0.3361, postcode: "HA1 1BB" },
    { name: "Stanmore", zone: 5, lat: 51.6192, lon: -0.1741, postcode: "HA7 4PD" },
    { name: "Edgware", zone: 5, lat: 51.6136, lon: -0.1731, postcode: "HA8 7AW" },
    { name: "Cockfosters", zone: 5, lat: 51.6517, lon: -0.1494, postcode: "EN4 0DZ" },
    { name: "Becontree", zone: 5, lat: 51.5403, lon: 0.1269, postcode: "RM9 2HE" },
    { name: "Twickenham", zone: 5, lat: 51.4506, lon: -0.3375, postcode: "TW1 1BE" },

    // ZONE 6
    { name: "Heathrow Terminals 2 & 3", zone: 6, lat: 51.4714, lon: -0.4522, postcode: "TW6 1AP" },
    { name: "Upminster", zone: 6, lat: 51.5601, lon: 0.2512, postcode: "RM14 2TD" },
    { name: "Uxbridge", zone: 6, lat: 51.5463, lon: -0.4781, postcode: "UB8 1JZ" },
    { name: "Epping", zone: 6, lat: 51.6938, lon: 0.1142, postcode: "CM16 4HW" },
    { name: "Orpington", zone: 6, lat: 51.3732, lon: 0.0903, postcode: "BR6 0JQ" },
    { name: "Loughton", zone: 6, lat: 51.6414, lon: 0.0419, postcode: "IG10 4RE" }
];


let currentPersonaMarker = null; 

map.on('load', () => {
    
    map.addSource('stations-source', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": TUBE_NETWORK_DATABASE.map(s => ({
                "type": "Feature",
                "properties": { "name": s.name, "zone": s.zone, "postcode": s.postcode },
                "geometry": { "type": "Point", "coordinates": [s.lon, s.lat] }
            }))
        }
    });

    // color
    map.addLayer({
        id: 'stations-dots-layer',
        type: 'circle',
        source: 'stations-source',
        paint: {
            'circle-radius': 8,
            'circle-color': [
                'match', ['get', 'zone'],
                1, '#5eead4', // Zone 1
                2, '#38bdf8', // Zone 2
                3, '#818cf8', // Zone 3
                4, '#fbbf24', // Zone 4
                5, '#fb923c', // Zone 5
                6, '#ef4444', // Zone 6
                '#ffffff'
            ],
            'circle-stroke-color': '#000',
            'circle-stroke-width': 1.5,
            'circle-opacity': 0.9
        }
    });

    
    map.on('click', 'stations-dots-layer', (e) => {
        const properties = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates;

        const stationName = properties.name;
        const zone = properties.zone;
        const postcode = properties.postcode;

        
        if (currentPersonaMarker) {
            currentPersonaMarker.setLngLat(coordinates);
        } else {
            
            const el = document.createElement('div');
            el.className = 'persona-marker';
            el.innerHTML = '🚶‍♂️';
            el.style.fontSize = '24px';
            el.style.cursor = 'pointer';

            currentPersonaMarker = new mapboxgl.Marker(el)
                .setLngLat(coordinates)
                .addTo(map);
        }

       
        updateAuditDashboard(stationName, zone, postcode, coordinates);
    });

    // stop
    map.on('mouseenter', 'stations-dots-layer', () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', 'stations-dots-layer', () => map.getCanvas().style.cursor = '');
});


function updateAuditDashboard(stationName, zone, postcode, coordinates) {
    const resultsPanel = document.getElementById('audit-results');
    const statusBox = document.getElementById('status-box');

    if(statusBox) statusBox.style.display = 'none';
    if(resultsPanel) resultsPanel.style.display = 'block';


    const userAnnual = FARE_DATA.london[zone] || 2976;
    const zone1Annual = FARE_DATA.london[1];
    const vsZone1 = userAnnual - zone1Annual;


    document.getElementById('res-zone').innerText = `ZONE ${zone}`;
    document.getElementById('res-station').innerText = `Target Node: ${stationName} Station (Postcode: ${postcode})`;
    document.getElementById('res-fare').innerText = `£${userAnnual.toLocaleString()}`;
    
    if (vsZone1 === 0) {
        document.getElementById('res-vs-z1').innerText = "£0 (BASE RATE ACCESS)";
    } else {
        document.getElementById('res-vs-z1').innerText = `+£${vsZone1.toLocaleString()}`;
    }


    const lineGeoJSON = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": { "type": "LineString", "coordinates": [coordinates, LONDON_CENTER] }
        }]
    };
    if (map.getSource('flow-line-source')) {
        map.getSource('flow-line-source').setData(lineGeoJSON);
    }
}


const STATIONS_GEOJSON = {
    "type": "FeatureCollection",
    "features": TUBE_NETWORK_DATABASE.map(s => ({
        "type": "Feature",
        "properties": { "name": s.name, "zone": s.zone },
        "geometry": { "type": "Point", "coordinates": [s.lon, s.lat] }
    }))
};

const VISUAL_ZONES_GEOJSON = {
    "type": "FeatureCollection",
    "features": [
        { "type": "Feature", "properties": { "zone": 1, "radius": 4500 }, "geometry": { "type": "Point", "coordinates": LONDON_CENTER } },
        { "type": "Feature", "properties": { "zone": 2, "radius": 8000 }, "geometry": { "type": "Point", "coordinates": LONDON_CENTER } },
        { "type": "Feature", "properties": { "zone": 3, "radius": 12000 }, "geometry": { "type": "Point", "coordinates": LONDON_CENTER } },
        { "type": "Feature", "properties": { "zone": 4, "radius": 17000 }, "geometry": { "type": "Point", "coordinates": LONDON_CENTER } },
        { "type": "Feature", "properties": { "zone": 5, "radius": 22000 }, "geometry": { "type": "Point", "coordinates": LONDON_CENTER } },
        { "type": "Feature", "properties": { "zone": 6, "radius": 30000 }, "geometry": { "type": "Point", "coordinates": LONDON_CENTER } }
    ]
};

map.on('load', () => {
    map.addSource('london-gradient-source', { type: 'geojson', data: VISUAL_ZONES_GEOJSON });
    map.addLayer({
        id: 'london-gradient-layer',
        type: 'heatmap',
        source: 'london-gradient-source',
        maxzoom: 15,
        paint: {
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 9, ['*', ['get', 'radius'], 0.02], 11, ['*', ['get', 'radius'], 0.05]],
            'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 
                0, 'rgba(255, 68, 68, 0)', 
                0.2, 'rgba(255, 68, 68, 0.05)',  
                0.5, 'rgba(255, 68, 68, 0.15)', 
                0.8, 'rgba(255, 68, 68, 0.35)', 
                1, 'rgba(255, 68, 68, 0.60)'     
            ],
            'heatmap-opacity': 0.9
        }
    });

    map.addSource('stations-source', { type: 'geojson', data: STATIONS_GEOJSON });
    map.addLayer({
        id: 'stations-dots-layer',
        type: 'circle',
        source: 'stations-source',
        paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 9, 4.5, 14, 9],
            'circle-color': [
                'match', ['get', 'zone'],
                1, '#5eead4', 
                2, '#38bdf8', 
                3, '#818cf8', 
                4, '#fbbf24', 
                5, '#fb923c', 
                6, '#ef4444', 
                '#ffffff'
            ],
            'circle-opacity': 0.85,
            'circle-stroke-color': '#000',
            'circle-stroke-width': 1.2
        }
    });

    map.addSource('flow-line-source', { type: 'geojson', data: { "type": "FeatureCollection", "features": [] } });
    map.addLayer({
        id: 'flow-line-layer',
        type: 'line',
        source: 'flow-line-source',
        paint: {
            'line-color': '#ef4444',
            'line-width': 3,
            'line-dasharray': [2, 2], 
            'line-opacity': 0.8
        }
    });
});

document.getElementById('auditBtn').addEventListener('click', runAudit);
document.getElementById('pcInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') runAudit(); });

let currentMarker = null;

async function runAudit() {
    const postcode = document.getElementById('pcInput').value.trim().replace(/\s+/g, '');
    const statusBox = document.getElementById('status-box');
    const resultsPanel = document.getElementById('audit-results');

    if (!postcode) return;

    statusBox.style.display = 'block';
    resultsPanel.style.display = 'none';
    statusBox.innerHTML = "STATUS: QUERYING SPATIAL DATABASE...";

    try {
        const pcRes = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
        const pcData = await pcRes.json();
        
        if (pcData.status !== 200) {
            statusBox.innerHTML = "STATUS: <span style='color:#ff4444'>SIGNAL_ERROR</span><br><br>Geographical area not recognized.";
            return;
        }

        const { latitude, longitude } = pcData.result;
        statusBox.innerHTML = "STATUS: COORDS ACQUIRED.<br>CROSS-REFERENCING TFL LAYER...";

        
        let closestStation = TUBE_NETWORK_DATABASE[0];
        let minD = Infinity;
        
        TUBE_NETWORK_DATABASE.forEach(s => {
            
            const d = getHaversineDistance(latitude, longitude, s.lat, s.lon);
            if (d < minD) { 
                minD = d; 
                closestStation = s; 
            }
        });

        const userZone = closestStation.zone;
        
        //fix
        const distanceKM = getHaversineDistance(latitude, longitude, LONDON_CENTER[1], LONDON_CENTER[0]);

        const userAnnual = FARE_DATA.london[userZone];
        const zone1Annual = FARE_DATA.london[1];
        const nyAnnual = FARE_DATA.newYork;
        const vsZone1 = userAnnual - zone1Annual;
        const vsNY = Math.round(userAnnual - nyAnnual);

        
        document.getElementById('res-zone').innerText = `ZONE ${userZone}`;
        document.getElementById('res-station').innerText = `Target Node: ${closestStation.name} Station (${distanceKM.toFixed(2)} km displacement)`;
        document.getElementById('res-fare').innerText = `£${userAnnual.toLocaleString()}`;
        
        
        if (vsZone1 === 0) {
            document.getElementById('res-vs-z1').innerText = "£0 (BASE RATE ACCESS)";
        } else {
            document.getElementById('res-vs-z1').innerText = `+£${vsZone1.toLocaleString()}`;
        }
        
        document.getElementById('res-vs-ny').innerText = vsNY > 0 ? `+£${vsNY.toLocaleString()}` : `-£${Math.abs(vsNY).toLocaleString()}`;

        statusBox.style.display = 'none';
        resultsPanel.style.display = 'block';

        
        const lineGeoJSON = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": { "type": "LineString", "coordinates": [[longitude, latitude], LONDON_CENTER] }
            }]
        };
        map.getSource('flow-line-source').setData(lineGeoJSON);

        if (currentMarker) currentMarker.remove();
        currentMarker = new mapboxgl.Marker({ color: '#ef4444' })
            .setLngLat([longitude, latitude])
            .addTo(map);

        const bounds = new mapboxgl.LngLatBounds().extend([longitude, latitude]).extend(LONDON_CENTER);
        map.fitBounds(bounds, { padding: 130, pitch: 50, duration: 2000 });

    } catch (error) {
        statusBox.innerHTML = "STATUS: <span style='color:#ff4444'>SYSTEM_ERROR</span>";
        console.error(error);
    }
}

function getHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}


function loadAndProcessBoroughData() {
    Papa.parse('london_borough_data.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            const processedData = results.data.map(row => {
                
                if (!row.borough) return null;
                
                const zone = parseInt(row.dominant_zone);
                const annualFare = FARE_DATA.london[zone] || 2976;
                const burdenRatio = ((annualFare / row.avg_income) * 100).toFixed(1);
                
                return {
                    x: row.avg_income,          
                    y: parseFloat(burdenRatio), 
                    r: Math.max(row.poverty_rate * 0.6, 5),  
                    name: row.borough,
                    zone: zone
                };
            }).filter(item => item !== null);


            renderBubbleChart(processedData);

          
            const sortedByBurden = [...processedData].sort((a, b) => b.y - a.y);

  
            const heavyList = document.getElementById('heavy-boroughs-list');
            if (heavyList) {
                heavyList.innerHTML = sortedByBurden.slice(0, 3).map((b, index) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; background: #140505; border: 1px solid #3a1111; padding: 10px 12px; margin-bottom: 6px; font-size: 0.8em;">
                        <span><b style="color:#ff4444; margin-right:5px;">#${index+1}</b> ${b.name} (Zone ${b.zone})</span>
                        <span style="color: #ff4444; font-weight: bold;">${b.y}% Burden</span>
                    </div>
                `).join('');
            }

           
            const lightList = document.getElementById('light-boroughs-list');
            if (lightList) {
                const lowest = sortedByBurden.slice(-3).reverse();
                lightList.innerHTML = lowest.map((b, index) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; background: #051412; border: 1px solid #113a34; padding: 10px 12px; margin-bottom: 6px; font-size: 0.8em;">
                        <span><b style="color:#5eead4; margin-right:5px;">#${index+1}</b> ${b.name} (Zone ${b.zone})</span>
                        <span style="color: #5eead4; font-weight: bold;">${b.y}% Burden</span>
                    </div>
                `).join('');
            }
        }
    });
}

function renderBubbleChart(chartDataset) {
    const ctx = document.getElementById('bubbleChart').getContext('2d');
    
    if (myBubbleChart) {
        myBubbleChart.destroy();
    }
    
    myBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'London 32 Boroughs',
                data: chartDataset,
                
                backgroundColor: (context) => {
                    const zone = context.raw?.zone;
                    if (zone === 1) return 'rgba(94, 234, 212, 0.75)';  
                    if (zone === 2 || zone === 3) return 'rgba(56, 189, 248, 0.65)'; 
                    if (zone === 4 || zone === 5) return 'rgba(251, 146, 60, 0.65)'; 
                    if (zone === 6) return 'rgba(239, 68, 68, 0.8)';  
                    return 'rgba(255, 255, 255, 0.5)';
                },
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                
                tooltip: {
                    backgroundColor: '#0c0c0c',
                    titleColor: '#ff4444',
                    titleFont: { size: 14, family: 'Courier New', weight: 'bold' },
                    bodyFont: { family: 'Courier New' },
                    borderColor: '#333',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return `[AUDIT NODE: ${context[0].raw.name.toUpperCase()}]`;
                        },
                        label: function(context) {
                            const data = context.raw;
                            return [
                                `  Spatial Layer : London Zone ${data.zone}`,
                                `  Annual Income : £${data.x.toLocaleString()}`,
                                `  Transit Burden: ${data.y}% of Income`,
                                `  Poverty Index : ${Math.round(data.r / 0.6)}%`
                            ];
                        }
                    }
                },
                legend: { display: false } 
            },
            scales: {
                x: { 
                    grid: { color: '#111' },
                    title: { display: true, text: 'Average Annual Income (£)', color: '#94a3b8', font: { family: 'Courier New' } },
                    ticks: { color: '#64748b', font: { family: 'Courier New' } }
                },
                y: { 
                    grid: { color: '#111' },
                    title: { display: true, text: 'Transit Burden Ratio (%)', color: '#94a3b8', font: { family: 'Courier New' } },
                    ticks: { color: '#64748b', font: { family: 'Courier New' } }
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", loadAndProcessBoroughData);