type MessageHandler = (data: string) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<number, MessageHandler> = new Map();
  private reconnectTimer: number | null = null;
  private reconnectDelay = 3000;
  private url: string;

  constructor(url: string = 'ws://nixie.local:81/') {
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

  send(command: number, data: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = String.fromCharCode(command) + data;
      this.ws.send(message);
      console.log(`WebSocket sent - Command: ${command}, Data: ${data}`);
    } else {
      console.warn('WebSocket is not connected. Message not sent.');
    }
  }

  sendFile(command: number, metadata: string, fileData: ArrayBuffer): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const commandByte = new Uint8Array([command]);
      const metadataBytes = new TextEncoder().encode(metadata);
      const separator = new Uint8Array([0]);

      const totalLength =
        commandByte.length + metadataBytes.length + separator.length + fileData.byteLength;
      const combined = new Uint8Array(totalLength);

      let offset = 0;
      combined.set(commandByte, offset);
      offset += commandByte.length;
      combined.set(metadataBytes, offset);
      offset += metadataBytes.length;
      combined.set(separator, offset);
      offset += separator.length;
      combined.set(new Uint8Array(fileData), offset);

      this.ws.send(combined.buffer);
      console.log(
        `WebSocket sent file - Command: ${command}, Metadata: ${metadata}, Size: ${fileData.byteLength} bytes`
      );
    } else {
      console.warn('WebSocket is not connected. File not sent.');
    }
  }
}

export const websocketService = new WebSocketService();
