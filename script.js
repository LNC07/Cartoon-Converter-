document.getElementById("videoInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const videoURL = URL.createObjectURL(file);
        document.getElementById("originalVideo").src = videoURL;
    }
});

document.getElementById("convertBtn").addEventListener("click", async function() {
    alert("🚀 Conversion Started! Please wait...");
    
    document.getElementById("progressContainer").style.display = "block";
    let progressBar = document.getElementById("progressBar");
    let progressText = document.getElementById("progressText");
    let timeLeft = document.getElementById("timeLeft");

    progressBar.value = 0;
    progressText.innerText = "0%";
    timeLeft.innerText = "Calculating...";

    // FFmpeg WASM Load
    const { createFFmpeg } = FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });

    // Progress Function
    ffmpeg.setProgress(({ ratio }) => {
        let percent = Math.round(ratio * 100);
        progressBar.value = percent;
        progressText.innerText = percent + "%";

        let estimatedTime = ((100 - percent) / 5).toFixed(1); // Estimate 5% per second
        timeLeft.innerText = estimatedTime + "s left";
    });

    await ffmpeg.load();

    // Input Video
    const inputVideo = document.getElementById("videoInput").files[0];
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(inputVideo));

    // Apply Animation Effect
    await ffmpeg.run('-i', 'input.mp4', '-vf', 'edgedetect', 'output.mp4');

    // Get Output Video
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const outputBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const outputURL = URL.createObjectURL(outputBlob);

    document.getElementById("animatedVideo").src = outputURL;
    alert("✅ Animation Video Ready! You can download it.");
});
