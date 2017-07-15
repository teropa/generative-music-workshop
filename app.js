console.log('Hello Tone:', Tone.version);

const buffer = new Tone.Buffer('sound.mp3');

Tone.Buffer.on('load', () => {
  const pitchShift = new Tone.PitchShift(8).toMaster();
  const player = new Tone.Player(buffer).connect(pitchShift);
  const synth = new Tone.Synth({
    oscillator: { type: 'fmsine' },
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

  MidiConvert.load('song.mid', function(midi) {
    const track = midi.tracks[0];
    const markovChain = {};
    for (let i = 0; i < track.notes.length - 1; i++) {
      const fromMidi = track.notes[i].midi;
      const toMidi = track.notes[i + 1].midi;
      if (!markovChain[fromMidi]) {
        markovChain[fromMidi] = [];
      }
      markovChain[fromMidi].push(toMidi);
    }

    const chain = new Tone.CtrlMarkov(markovChain);
    Tone.Transport.scheduleRepeat(time => {
      synth.triggerAttackRelease(chain.next(), 0.5, time);
    }, 1);
    //Tone.Transport.start();
  });
});
