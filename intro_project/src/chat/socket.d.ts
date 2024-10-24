// src/socket.d.ts
import 'socket.io';

declare module 'socket.io' {
  interface Socket {
    user?: any; // Adjust the type according to your user object
  }
}
