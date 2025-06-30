// Script to create silent placeholder sound files
const fs = require('fs');
const path = require('path');

// Create silent WAV file (44.1kHz, 16-bit, mono, 0.1 seconds)
function createSilentWav(duration = 0.1) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const bufferSize = 44 + (numSamples * 2); // WAV header + PCM data
  
  const buffer = Buffer.alloc(bufferSize);
  
  // WAV Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(bufferSize - 8, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // audio format (PCM)
  buffer.writeUInt16LE(1, 22); // num channels
  buffer.writeUInt32LE(sampleRate, 24); // sample rate
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40); // data chunk size
  
  // PCM data (all zeros = silence)
  for (let i = 44; i < bufferSize; i++) {
    buffer[i] = 0;
  }
  
  return buffer;
}

// Create sounds directory if it doesn't exist
const soundsDir = path.join(__dirname, '../public/sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Create placeholder sound files
const soundFiles = [
  'click.wav',
  'open.wav', 
  'close.wav',
  'minimize.wav',
  'error.wav',
  'login.wav',
  'notification.wav'
];

soundFiles.forEach(filename => {
  const filePath = path.join(soundsDir, filename);
  if (!fs.existsSync(filePath)) {
    const silentWav = createSilentWav(0.1); // 0.1 second silent sound
    fs.writeFileSync(filePath, silentWav);
    console.log(`Created: ${filename}`);
  } else {
    console.log(`Already exists: ${filename}`);
  }
});

console.log('Sound files created successfully!');
