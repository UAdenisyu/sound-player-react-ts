import { useCallback, useState, useRef } from 'react';
import SoundDriver from '../sound-driver/sound-driver';
import './player.scss';
import Spinner from '../spinner/spinner';

function Player() {
  const soundController = useRef<undefined | SoundDriver>(undefined);
  const [loading, setLoading] = useState(false);
  let fileName = useRef('');

  const uploadAudio = useCallback(async (event : any) => {
    const { files } = event.target;

    if (!files.length) {
      return;
    }

    setLoading(true);

    const audioFile = files[0];
    fileName.current = '"' + audioFile.name +'"';

    if (!audioFile || !audioFile.type.includes('audio')) {
      throw new Error('Wrong audio file');
    }

    const soundInstance = new SoundDriver(audioFile);
    try {
      await soundInstance.init(document.getElementById('waveContainer'));
      soundController.current = soundInstance;
    } catch(err) {
      console.log(err);
    } finally {
      setLoading(false);
      soundInstance.drawChart();
    }
  }, []);

  const togglePlayer = useCallback(
    (type: string) => () => {
      if (type === 'play') {
        soundController.current?.play();
      } else if (type === 'stop') {
        soundController.current?.pause(true);
      } else {
        soundController.current?.pause();
      }
    },
    []
  );

  const onVolumeChange = useCallback(
    (event:any) => {
      soundController.current?.changeVolume(Number(event.target.value));
    },
    [soundController]
  );
 
  

  return (
    <div style={{ width: '100%' }}>
        <div id="waveContainer"/>
            {!loading && !soundController.current && (
                <div className="chooseFileWrapper">
                    <p>Choose a sound:</p> &nbsp;
                    <input
                        type="file"
                        name="sound"
                        onChange={uploadAudio}
                        accept="audio/*"
                    />
                </div>
            )}
        {loading && <Spinner/>}
        {!loading && soundController.current && (
            <div id="soundEditor">
                <div className="currentSound"><p>Current sound:</p>{fileName.current} </div>
                <div id="controllPanel">
                    <input
                    type="range"
                    onChange={onVolumeChange}
                    defaultValue={1}
                    min={-1}
                    max={1}
                    step={0.01}
                    />

                    <button type="button" onClick={togglePlayer('play')}>
                    Play
                    </button>

                    <button type="button" onClick={togglePlayer('pause')}>
                    Pause
                    </button>

                    <button type="button" onClick={togglePlayer('stop')}>
                    Stop
                    </button>
                </div>
            </div>
        )}

    </div>
  );
}

export default Player;