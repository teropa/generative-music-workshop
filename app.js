console.log('Hello Tone:', Tone.version);

const buffer = new Tone.Buffer('sound.mp3');

Tone.Buffer.on('load', () => {
  const pitchShift = new Tone.PitchShift(8).toMaster();
  const player = new Tone.Player(buffer).connect(pitchShift);
  const synth = new Tone.Synth({
    oscillator: { type: 'pwm' },
    envelope: { attack: 0.2, decay: 1, release: 0.5 }
  }).toMaster();
  const pattern = new Tone.CtrlPattern(
    ['C3', 'D3', 'Eb3', 'F3', 'G3', 'A3', 'B3'],
    'alternateUp'
  );

  player.loop = true;
  player.loopStart = 1.5;
  player.loopEnd = buffer.duration - 1;
  player.playbackRate = 0.1;

  //player.start();
  Tone.Transport.scheduleRepeat(time => {
    synth.triggerAttackRelease(pattern.next(), 0.1, time);
  }, 0.1);
  //Tone.Transport.start();
});
