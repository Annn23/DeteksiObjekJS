const videoElement = document.getElementById('webcam');
const canvas = document.getElementById('overlay');
const resultElement = document.getElementById('result');
const ctx = canvas.getContext('2d');
let model;

// Waktu terakhir pembaruan hasil
let lastUpdateTime = 0;
const updateInterval = 5000; // Perbarui hasil setiap 5 detik

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
    });
    videoElement.srcObject = stream;
    await new Promise(resolve => {
        videoElement.onloadedmetadata = () => resolve();
    });
}

async function loadModel() {
    console.log("Memuat model COCO-SSD...");
    model = await cocoSsd.load(); // Muat model COCO-SSD
}

function detectFrame() {
    model.detect(videoElement).then(predictions => {
        console.log("🚀 ~ model.detect ~ predictions:", predictions);
        displayResults(predictions);
        requestAnimationFrame(detectFrame);
    });
}

function displayResults(predictions) {
    const currentTime = Date.now();

    // Perbarui hasil hanya jika interval waktu telah terpenuhi
    if (currentTime - lastUpdateTime >= updateInterval) {
        lastUpdateTime = currentTime;

        // Reset isi elemen hasil
        resultElement.innerHTML = "";

        predictions.forEach(prediction => {
            const text = `${prediction.class}: ${(prediction.score * 100).toFixed(1)}%`;
            const resultItem = document.createElement('div');
            resultItem.textContent = text;
            resultElement.appendChild(resultItem);
        });
    }
}

async function main() {
    await setupCamera();
    await loadModel();
    detectFrame(); // Mulai deteksi secara otomatis
}

main().catch(err => console.error(err));
