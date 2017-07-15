console.log('Hello Tone:', Tone.version);

const piano = new Piano.default().toMaster();
piano.load('node_modules/piano/Salamander/').then(() => {
  piano.pedalDown();
  const scale = ['C4', 'D4', 'E4', 'F4', 'G4', 'Ab4', 'B4'];

  const ws = new WebSocket(
    'ws://tweetsformusic.eu-west-1.elasticbeanstalk.com/'
  );
  ws.addEventListener('open', () => {
    console.log('opened');
  });
  ws.addEventListener('message', event => {
    const text = JSON.parse(event.data).text;
    const jsIndex = text.toLowerCase().indexOf('javascript');
    if (jsIndex >= 0) {
      const normalizedIndex = jsIndex / 130;
      const arrayIndex = Math.floor(normalizedIndex * scale.length);
      const note = scale[arrayIndex];
      piano.keyDown(note, 0.7, Tone.now());
      piano.keyUp(note, Tone.now() + 2);
      console.log(text);
    }
  });
});
