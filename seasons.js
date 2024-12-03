const seasons = ["autumn", "winter", "spring", "summer"];
const seasonDuration = 43200;
const formatTime = (s) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const formatAbsoluteTime = (t) => new Date(t * 1000).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true });
function getCurrentSeasonInfo() {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const totalElapsedTime = currentTime % (seasonDuration * 4);
    const seasonIndex = Math.floor(totalElapsedTime / seasonDuration);
    const timeInCurrentSeason = totalElapsedTime % seasonDuration;
    const timeRemaining = seasonDuration - timeInCurrentSeason;
    return { seasonIndex, timeRemaining, currentTime };
};
function updateSeasons() {
    const { seasonIndex, timeRemaining, currentTime } = getCurrentSeasonInfo();
    seasons.forEach((season, index) => {
        const titleElement = document.getElementById(`${season}.title`);
        const timerElement = document.getElementById(`${season}.timer`);
        const seasonDiv = document.querySelector(`.${season}.season`);
        if (index === seasonIndex) {
            titleElement.innerHTML = `${season.charAt(0).toUpperCase() + season.slice(1)}<span style="font-style: italic; font-size: small; font-weight: light;"> (current)</span>`;
            seasonDiv.classList.add("current");
            timerElement.innerHTML = `<span class="w">Ends in</span> <span class="time">${formatTime(timeRemaining)}</span>`;
            const endTime = currentTime + timeRemaining;
            timerElement.setAttribute("title", `${formatAbsoluteTime(endTime)}`);
        } else {
            titleElement.innerHTML = season.charAt(0).toUpperCase() + season.slice(1);
            seasonDiv.classList.remove("current");
            const cyclesAhead = (index - seasonIndex + 4) % 4;
            const startIn = cyclesAhead * seasonDuration - (seasonDuration - timeRemaining);
            timerElement.innerHTML = `<span class="w">Starts in</span> <span class="time">${formatTime(startIn)}</span>`;
            const startTime = currentTime + startIn;
            timerElement.setAttribute("title", `${formatAbsoluteTime(startTime)}`);
        };
    });
    setTimeout(updateSeasons, 1000);
};
updateSeasons();