import { useContext } from 'react';
import { IconButton } from '@chakra-ui/react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

import UIContext from '../containers/UIContext';

function MuteButton() {
  const { muted, setMuted } = useContext(UIContext);
  return (
    <IconButton
      leftIcon={muted ? <FaVolumeMute /> : < FaVolumeUp />}
      variant="ghost"
      onClick={() => setMuted(!muted)}>
    </IconButton>
  );
}

export default MuteButton;
