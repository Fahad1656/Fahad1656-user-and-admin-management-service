// src/hooks/useSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./context/AuthContext";

const useSocket = () => {
  const { token } = useAuth();
  const socket = useRef(null);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(import.meta.env.VITE_API_URL, {
        transports: ["websocket"],
        auth: { token },
      });

      socket.current.on("connect", () => {
        console.log("Connected to the server with ID:", socket.current.id);
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from server");
      });

      socket.current.on("error", (error) => {
        console.error("Socket error:", error);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [token]);

  return socket.current;
};

export default useSocket;
