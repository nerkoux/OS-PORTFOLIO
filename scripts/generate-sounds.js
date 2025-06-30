// Simple script to generate basic system sounds
// Run this in a browser console to download basic sounds

function generateTone(frequency, duration, type = 'sine') {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
  
  return audioContext;
}

// Generate basic sounds
const sounds = {
  click: () => generateTone(800, 0.1, 'square'),
  open: () => generateTone(600, 0.3, 'sine'),
  close: () => generateTone(400, 0.2, 'sine'),
  minimize: () => generateTone(300, 0.15, 'triangle'),
  error: () => generateTone(200, 0.5, 'sawtooth'),
  notification: () => generateTone(1000, 0.2, 'sine'),
  login: () => generateTone(500, 0.4, 'sine'),
  boot: () => generateTone(440, 1.0, 'sine')
};

console.log('Copy and run individual sound functions in browser console to test sounds');
console.log('Example: sounds.click()');
