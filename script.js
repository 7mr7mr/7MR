const video = document.getElementById('video');
const results = document.getElementById('results');

async function startVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;
}

async function loadModels() {
  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/models';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
}

function getRecommendation(expressions) {
  const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
  const [topEmotion] = sorted[0];

  switch (topEmotion) {
    case 'happy': return 'أنت سعيد! استمر فيما تفعله 🌟';
    case 'sad': return 'يبدو أنك حزين. جرب الخروج لنزهة أو الاستماع للموسيقى 🎧';
    case 'angry': return 'تشعر بالغضب. خذ نفسًا عميقًا أو مارس التأمل 🧘';
    case 'surprised': return 'من الواضح أنك مندهش! شارك إحساسك.';
    case 'disgusted': return 'ربما تحتاج إلى تغيير في المحيط.';
    case 'fearful': return 'خوف ظاهر، تواصل مع من يطمئنك.';
    case 'neutral': return 'مزاجك متوازن، يمكنك تجربة نشاط جديد!';
    default: return 'جارٍ تحليل مشاعرك...';
  }
}

video.addEventListener('play', () => {
  setInterval(async () => {
    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detection && detection.expressions) {
      const msg = getRecommendation(detection.expressions);
      results.textContent = msg;
    }
  }, 3000);
});

loadModels().then(startVideo);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => {
    console.log("✅ Service Worker Registered");
  });
}
