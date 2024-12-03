const canvas = document.getElementById('gameMap');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');
const treasures = document.getElementById('treasures');
const update = document.getElementById('update');
const treasurehunt = document.getElementById('treasurehunt');
const details = document.getElementById('details');
const treasurehuntbtn = document.getElementById('treasurehuntbtn');
const canvasCenterX = canvas.width / 2;
const canvasCenterY = canvas.height / 2;
const maxRadius = (Math.min(canvas.width, canvas.height) / 2); 
const bounds = {
    xMin: -4500,
    xMax: 7500,
    zMin: 3500,
    zMax: -4500
};
const markerRadius = 6; 
const poi = [
    { display: "Moosewood", name: "Moosewood", color: "#bc5a5b", x: 350, z: 250 },
    { display: "Roslit", name: "Roslit Bay", color: "#c38468", x: -1450, z: 750 },
    { display: "Mushgrove", name: "Mushgrove Swamp", color: "#a3c78e", x: 2425, z: -670 },
    { display: "Terrapin", name: "Terrapin Island", color: "#32cba2", x: -200, z: 1925 },
    { display: "Snowcap", name: "Snowcap Island", color: "#87a6c2", x: 2900, z: 2500 },
    { display: "Sunstone", name: "Sunstone Island", color: "#a2b056", x: -935, z: -1105 },
    { display: "Forsaken Shores", name: "Forsaken Shores", color: "#ba484a", x: -2425, z: 1555 },
    { display: "Statue", name: "Statue of Sovereignty", color: "#bcbec0", x: 20, z: -1040 },
    { display: "Ancient Isle", name: "Ancient Isle", color: "#6ceebc", x: 5833, z: 401 },
    { display: "Desolate Deep", name: "Desolate Deep (Buoy)", color: "#2f2fbf", x: -790, z: -3100 },
    { display: "Harvesters Spike", name: "Harvesters Spike (Ocean)", color: "#8080ff", x: -1270, z: 1580 },
    { display: "Arch", name: "The Arch (Ocean)", color: "#8080ff", x: 1000, z: -1250 },
    { display: "Haddock Rock", name: "Haddock Rock (Ocean)", color: "#8080ff", x: -530, z: -425 },
    { display: "Earmark", name: "Earmark Island (Ocean)", color: "#8080ff", x: 1230, z: 575 },
    { display: "Birch Cay", name: "Birch Cay (Ocean)", color: "#8080ff", x: 1700, z: -2500 },
];
let markers = [];
function scale(value, min, max, maxRadius) {
    return ((value - min) / (max - min)) * (2 * maxRadius) - maxRadius;
}
function scaleToGameCoordinates(mouseX, mouseY) {
    const dx = mouseX - canvasCenterX;
    const dy = canvasCenterY - mouseY; 
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= maxRadius) {
        const scaledX = bounds.xMin + ((dx + maxRadius) / (2 * maxRadius)) * (bounds.xMax - bounds.xMin);
        const scaledZ = bounds.zMin + ((dy + maxRadius) / (2 * maxRadius)) * (bounds.zMax - bounds.zMin);
        return { x: scaledX, z: scaledZ };
    }
    return null;
}
function drawText(text, x, y, color, size, b) {
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 3;
    ctx.font = `${size}px "nunitosans"`;
    ctx.textAlign = "center";
    if (b) ctx.textBaseline = b; 
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
}
function drawCompass() {
    drawText("N", canvasCenterX, 20, "white", 16, "middle"); 
    drawText("S", canvasCenterX, canvas.height - 20, "white", 16, "middle"); 
    drawText("E", canvas.width - 20, canvasCenterY, "white", 16, "middle"); 
    drawText("W", 20, canvasCenterY, "white", 16, "middle"); 
    drawText("NE", canvasCenterX + (maxRadius - 20) / Math.SQRT2, canvasCenterY - (maxRadius - 20) / Math.SQRT2, "white", 16, "middle"); 
    drawText("NW", canvasCenterX - (maxRadius - 20) / Math.SQRT2, canvasCenterY - (maxRadius - 20) / Math.SQRT2, "white", 16, "middle"); 
    drawText("SE", canvasCenterX + (maxRadius - 20) / Math.SQRT2, canvasCenterY + (maxRadius - 20) / Math.SQRT2, "white", 16, "middle"); 
    drawText("SW", canvasCenterX - (maxRadius - 20) / Math.SQRT2, canvasCenterY + (maxRadius - 20) / Math.SQRT2, "white", 16, "middle"); 
}
function drawPOIs() {
    poi.forEach(location => {
        const scaledX = scale(location.x, bounds.xMin, bounds.xMax, maxRadius);
        const scaledZ = scale(location.z, bounds.zMin, bounds.zMax, maxRadius);
        const canvasX = canvasCenterX + scaledX;
        const canvasY = canvasCenterY - scaledZ; 
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, markerRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = location.color;
        ctx.fill();
        drawText(location.display, canvasX, canvasY + markerRadius + 7, location.color, 13, "top");
    });
}
function drawMarkers() {
    markers.forEach(location => {
        const scaledX = scale(location.x, bounds.xMin, bounds.xMax, maxRadius);
        const scaledZ = scale(location.z, bounds.zMin, bounds.zMax, maxRadius);
        const canvasX = canvasCenterX + scaledX;
        const canvasY = canvasCenterY - scaledZ; 
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, markerRadius / 2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = location.color;
        ctx.fill();
    })
}
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#127c87";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCompass();
    drawPOIs();
    drawMarkers();
}
function findClosestPoint(inputX, inputZ) {
    let closestPoint = null;
    let shortestDistance = Infinity;
    for (const point of poi) {
        const distance = Math.sqrt(Math.pow(point.x - inputX, 2) + Math.pow(point.z - inputZ, 2));
        if (distance < shortestDistance) {
            shortestDistance = distance;
            closestPoint = point;
        }
    }
    return closestPoint;
}
function calculateDirection(from, to) {
    const directions = [
        { start: 330, end: 360, direction: "E" },
        { start: 0, end: 30, direction: "E" },
        { start: 30, end: 75, direction: "SE" },
        { start: 75, end: 120, direction: "S" },
        { start: 120, end: 165, direction: "SW" },
        { start: 165, end: 210, direction: "W" },
        { start: 210, end: 255, direction: "NW" },
        { start: 255, end: 300, direction: "N" },
        { start: 300, end: 330, direction: "NE" },
    ];
    const dx = to.x - from.x;
    const dz = to.z - from.z;
    const angle = Math.atan2(dz, dx) * (180 / Math.PI);
    const normalizedAngle = (angle + 360) % 360;
    for (const { start, end, direction } of directions) {
        if ((start <= normalizedAngle && normalizedAngle < end) ||
            (start > end && (normalizedAngle >= start || normalizedAngle < end))) {
            return direction;
        }
    }
    return "";
}
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    let hoveredPOI = null;
    poi.some(location => {
        const scaledX = scale(location.x, bounds.xMin, bounds.xMax, maxRadius);
        const scaledZ = scale(location.z, bounds.zMin, bounds.zMax, maxRadius);
        const canvasX = canvasCenterX + scaledX;
        const canvasY = canvasCenterY - scaledZ;
        const distance = Math.sqrt((mouseX - canvasX) ** 2 + (mouseY - canvasY) ** 2);
        if (distance <= markerRadius) { 
            hoveredPOI = location;
            return true;
        }
        return false;
    });
    markers.some(location => {
        const scaledX = scale(location.x, bounds.xMin, bounds.xMax, maxRadius);
        const scaledZ = scale(location.z, bounds.zMin, bounds.zMax, maxRadius);
        const canvasX = canvasCenterX + scaledX;
        const canvasY = canvasCenterY - scaledZ;
        const distance = Math.sqrt((mouseX - canvasX) ** 2 + (mouseY - canvasY) ** 2);
        if (distance <= markerRadius) { 
            hoveredPOI = location;
            return true;
        }
        return false;
    });
    if (hoveredPOI) {
        tooltip.style.display = 'block';
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
        tooltip.innerHTML = `<span style="font-size: large; font-weight: bolder; color: ${hoveredPOI.color}">${hoveredPOI.name}</span><hr>GPS: <span class="r">${hoveredPOI.x}</span>, <span class="g">125</span>, <span class="b">${hoveredPOI.z}</span>`;
    } else {
        const gameCoords = scaleToGameCoordinates(mouseX, mouseY);
        if (gameCoords) {
            tooltip.style.display = 'block';
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
            tooltip.innerHTML = `GPS: <span class="r">${Math.round(gameCoords.x)}</span>, <span class="g">125</span>, <span class="b">${Math.round(gameCoords.z)}</span>`;
        } else {
            tooltip.style.display = 'none';
        }
    }
});
canvas.addEventListener('mouseout', () => {
    tooltip.style.display = 'none';
});
treasures.addEventListener('input', () => { 
    treasures.rows = Math.max(13, treasures.value.split("\n").length);
});
update.addEventListener('click', () => {
    const coordinates = treasures.value.split("\n").filter(Boolean);
    let finalMarkers = [];
    coordinates.forEach(coordinate => {
        const xy = coordinate.split(" ").filter(Boolean);
        finalMarkers.push({ display: "", name: "Treasure", color: "#ffff80", x: xy[0], z: xy[1] })
    });
    markers = finalMarkers;
    drawMap();
    if (markers.length > 1) {
        const start = { x: 0, z: 0 };
        let remaining = [...markers];
        const route = [];
        let current = remaining.reduce((farthest, marker) => {
            const distance = Math.sqrt((marker.x - start.x) ** 2 + (marker.z - start.z) ** 2);
            return distance > Math.sqrt((farthest.x - start.x) ** 2 + (farthest.z - start.z) ** 2) ? marker : farthest;
        });
        route.push(current);
        remaining = remaining.filter(marker => marker !== current);
        while (remaining.length > 0) {
            current = remaining.reduce((closest, marker) => {
                const distance = Math.sqrt((marker.x - current.x) ** 2 + (marker.z - current.z) ** 2);
                const closestDistance = Math.sqrt((closest.x - current.x) ** 2 + (closest.z - current.z) ** 2);
                return distance < closestDistance ? marker : closest;
            });
            route.push(current);
            remaining = remaining.filter(marker => marker !== current);
        }
        ctx.beginPath();
        ctx.strokeStyle = "#ffff80";
        ctx.lineWidth = 2;
        route.forEach((marker, index) => {
            const scaledX = scale(marker.x, bounds.xMin, bounds.xMax, maxRadius);
            const scaledZ = scale(marker.z, bounds.zMin, bounds.zMax, maxRadius);
            const canvasX = canvasCenterX + scaledX;
            const canvasY = canvasCenterY - scaledZ; 
            if (index === 0) {
                ctx.moveTo(canvasX, canvasY); 
            } else {
                ctx.lineTo(canvasX, canvasY); 
            }
        });
        ctx.stroke();
        markers = route.map((location, i) => ({
            ...location,
            display: (i + 1).toString()
        }));
        treasurehunt.style.display = "block";
        treasurehuntbtn.style.display = "inline-block";
        async function step(lp, i) {
            return new Promise((resolve) => {
                const treasure = route[i];
                const closestPoint = findClosestPoint(treasure.x, treasure.z);
                const direction = calculateDirection(lp, treasure).split('');
                const directionnames = {"N": "north", "S": "south", "E": "east", "W": "west"};
                const directionstr = direction.length > 0 ? direction.length === 1 ? `${directionnames[direction[0]]} (${direction[0]})` : `${directionnames[direction[0]]}${directionnames[direction[1]]} (${direction[0]}${direction[1]})` : "";
                details.innerHTML = `<span class="gray">treasure ${i + 1} out of ${route.length} (${Math.floor((((i + 1) / route.length) * 100) * 100) / 100}%)</span><br>${i === 0 ? "firstly" : (i === route.length - 1 ? "lastly" : "then")}, ${directionstr !== "" ? "go" : "stay"} ${directionstr !== "" ? `${directionstr} to` : "in"}<br>GPS: <span class="r">${treasure.x}</span>, <span class="g">125</span>, <span class="b">${treasure.z}</span><br><span class="gray">close to ${closestPoint.display}</span><br>`;
                treasurehuntbtn.addEventListener("click", () => resolve(), { once: true });
            });
        }
        treasurehuntbtn.addEventListener("click", async () => {
            const lastPos = { x: 0, z: 0 };
            treasurehuntbtn.innerHTML = "continue";
            treasurehuntbtn.style.display = "none";
            treasurehuntbtn.style.display = "inline-block";
            for (let i = 0; i < route.length;) {
                await step(lastPos, i);
                lastPos.x = route[i].x;
                lastPos.z = route[i].z;
                i++;
                if (i + 1 === route.length) {
                    treasurehuntbtn.innerHTML = "end";
                    treasurehuntbtn.addEventListener("click", () => {
                        markers = [];
                        details.innerHTML = "";
                        treasurehuntbtn.innerHTML = "start treasure hunt";
                        treasurehuntbtn.style.display = "none";
                        treasurehuntbtn.style.display = "none";
                        drawMap();
                    }, { once: true });
                };
            };
        }, { once: true });
    } else {
        treasurehunt.style.display = "none";
    };
});
drawMap();