import '@styles/main.scss';
import '@components/header';
import '@pages/clock-settings';
import '@pages/wifi-settings';
import '@pages/info-settings';
import { websocketService } from '@services/websocket';

websocketService.connect();
