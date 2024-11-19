let mic, fft;
let lowFreqCircleRadius = 200;
let midFreqCircleRadius = 250;
let highFreqCircleRadius = 300;

let distortionScale = 100; // Dynamic distortion strength
let glowIntensity = 40; // Glow strength

let bgGif;

function preload() {
  bgGif = loadImage('two.gif'); // Load your background GIF
}

function setup() {
  createCanvas(800, 800);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(0.9, 1024); // Higher resolution FFT
  fft.setInput(mic);
}

function draw() {
  image(bgGif, 0, 0, width, height); // Draw background

  let spectrum = fft.analyze(); // Get the sound spectrum data

  drawFrequencyWave(spectrum, 0, 0.3, lowFreqCircleRadius, color(192, 55, 204), 8); // Low freq (Pink)
  drawFrequencyWave(spectrum, 0.3, 0.6, midFreqCircleRadius, color(50, 123, 179), 10); // Mid freq (Purple)
  drawFrequencyWave(spectrum, 0.6, 1, highFreqCircleRadius, color(110, 31, 163), 12); // High freq (Blue)
}

function drawFrequencyWave(spectrum, startFreq, endFreq, baseRadius, waveColor, strokeWeightValue) {
  let startIndex = floor(startFreq * spectrum.length);
  let endIndex = floor(endFreq * spectrum.length);

  noFill();
  stroke(waveColor);
  strokeWeight(strokeWeightValue);

  // Set the glow effect
  drawingContext.shadowBlur = glowIntensity;
  drawingContext.shadowColor = waveColor;

  beginShape();
  for (let i = startIndex; i < endIndex; i++) {
    let angle = map(i, startIndex, endIndex, 0, TWO_PI);
    let amplitude = spectrum[i];
    let distortion = map(amplitude, 0, 255, 0, distortionScale);

    let x = width / 2 + cos(angle) * (baseRadius + distortion);
    let y = height / 2 + sin(angle) * (baseRadius + distortion);

    vertex(x, y);
  }
  endShape(CLOSE);

  // Reset glow effect
  drawingContext.shadowBlur = 0;
}
