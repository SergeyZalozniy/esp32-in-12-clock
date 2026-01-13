type MessageHandler = (data: string) => void;
type ConnectHandler = () => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<number, MessageHandler> = new Map();
  private connectHandlers: ConnectHandler[] = [];
  private reconnectTimer: number | null = null;
  private reconnectDelay = 3000;
  private url: string;

  constructor(url: string = 'ws://justtime.local:81/') {
    this.url = url;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        // Call all registered connect handlers with a small delay to ensure connection is fully ready
        setTimeout(() => {
          this.connectHandlers.forEach((handler) => handler());
        }, 50);
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return;
    }

    this.reconnectTimer = window.setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect();
    }, this.reconnectDelay);
  }

  private handleMessage(data: string): void {
    if (!data || data.length === 0) {
      return;
    }

    const command = data.charCodeAt(0);
    const value = data.substring(1);

    console.log(`WebSocket message - Command: ${command}, Value: ${value}`);

    const handler = this.messageHandlers.get(command);
    if (handler) {
      handler(value);
    }
  }

  onMessage(command: number, handler: MessageHandler): void {
    this.messageHandlers.set(command, handler);
  }

  onConnect(handler: ConnectHandler): void {
    this.connectHandlers.push(handler);
  }

  send(command: number, data: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = String.fromCharCode(command) + data;
      this.ws.send(message);
      console.log(`WebSocket sent - Command: ${command}, Data: ${data}`);
    } else {
      console.warn('WebSocket is not connected. Message not sent.');
    }
  }

  sendFile(updateType: number, fileData: ArrayBuffer): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      // Binary upload format for ESP32:
      // Byte 0: update type (0 = firmware.bin, 1 = spiffs.bin)
      // Bytes 1-4: total file size (uint32_t, little-endian)
      // Bytes 5+: file data

      const fileSize = fileData.byteLength;
      const header = new Uint8Array(5);

      // Byte 0: update type
      header[0] = updateType;

      // Bytes 1-4: file size in little-endian format
      header[1] = fileSize & 0xFF;
      header[2] = (fileSize >> 8) & 0xFF;
      header[3] = (fileSize >> 16) & 0xFF;
      header[4] = (fileSize >> 24) & 0xFF;

      // Combine header and file data
      const combined = new Uint8Array(5 + fileSize);
      combined.set(header, 0);
      combined.set(new Uint8Array(fileData), 5);

      this.ws.send(combined.buffer);
      console.log(
        `WebSocket sent file - Type: ${updateType === 0 ? 'firmware' : 'spiffs'}, Size: ${fileSize} bytes`
      );
    } else {
      console.warn('WebSocket is not connected. File not sent.');
    }
  }
}

export const websocketService = new WebSocketService();
