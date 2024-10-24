import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ChatBox.css";

const API_URL = import.meta.env.VITE_API_URL;

const ChatBox = () => {
  const location = useLocation();
  const { profile } = location.state || {};
  const user = profile?.user || {};
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [skipUserCheck, setSkipUserCheck] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (token) {
      socketRef.current = io(API_URL, {
        transports: ["websocket"],
        auth: { token },
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("Connected to WebSocket", socket.id);
        setIsConnected(true);
      });

      socket.on("usersList", (users) => {
        console.log("Received users list:", users);
        setUsers(users);
      });

      socket.on("receiveMessage", (data) => {
        console.log("Received data:", data);
        if (data.type === "received" || data.type === "sent") {
          const { content } = data.message;
          if (typeof content === "string") {
            setMessages((prevMessages) =>
              [
                ...prevMessages,
                {
                  ...data.message,
                  createdAt: new Date(data.message.createdAt),
                },
              ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            );
          } else {
            console.error("Message content is not a string:", content);
          }
        } else {
          console.error("Unexpected data format:", data);
        }
      });

      return () => {
        if (socket) {
          socket.disconnect();
          console.log("Socket disconnected");
        }
        socket.off("connect");
        socket.off("disconnect");
        socket.off("usersList");
        socket.off("receiveMessage");
      };
    }
  }, [token]);

  useEffect(() => {
    if (socketRef.current && selectedUser) {
      console.log("This is the user", user.id);
      const payload = {
        senderId: user.id,
        receiverId: selectedUser.id,
      };

      socketRef.current.emit("requestMessages", payload, (response) => {
        console.log("Response from server:", response);

        if (response.status === "success") {
          const receivedMessages = (response.messages || []).map((msg) => {
            const content = Object.keys(msg)[0];
            const createdAt = msg[content];

            return {
              content: content || "No content available",
              user: createdAt[0],
              createdAt: new Date(createdAt[1]),
            };
          });

          console.log(" messages:", receivedMessages);

          setMessages((prevMessages) =>
            [...prevMessages, ...receivedMessages].sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            )
          );
        } else {
          console.error("Failed to fetch messages:", response.message);
        }
      });
    }
  }, [selectedUser, user.id]);

  useEffect(() => {
    console.log("skipUserCheck flag:", skipUserCheck);
  }, [skipUserCheck]);

  const handleUserClick = (clickedUser) => {
    setSelectedUser(clickedUser);
    console.log("Selected user:", clickedUser);
  };

  const handleSendMessage = () => {
    if (selectedUser && messageInput.trim()) {
      if (socketRef.current && socketRef.current.connected) {
        const messagePayload = {
          senderId: user.id,
          receiverId: selectedUser.id,
          content: messageInput.trim(),
        };

        setSkipUserCheck(true); // Set the flag to true

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            senderId: user.id,
            content: messageInput.trim(),
            createdAt: new Date(),
          },
        ]);

        socketRef.current.emit("sendMessage", messagePayload, (response) => {
          if (response.status !== "success") {
            console.error("Failed to send message:", response.message);
            setMessages((prevMessages) =>
              prevMessages.filter(
                (msg) => msg.content !== messagePayload.content
              )
            );
          }
          // Reset the flag here to ensure it's only done once after sending
          setSkipUserCheck(false);
        });

        setMessageInput("");
      } else {
        console.error("Socket is not connected!");
      }
    } else {
      console.error("Message input is empty or no user selected!");
    }
  };

  const onlineUsers = users.filter((u) => u.online && u.id !== user.id);
  const offlineUsers = users.filter((u) => !u.online);
  console.log(skipUserCheck,"dhukkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")

  return (
    <div id="chat-container">
      <div id="user-list">
        <h2 className="label">You</h2>
        <div className="user-item logged-in-user">
          <span className="me">{user.name}</span>
        </div>
        <h2 className="label">Online</h2>
        {onlineUsers.length > 0 ? (
          <div className="user-list-section">
            {onlineUsers.map((onlineUser) => (
              <div
                key={onlineUser.id}
                className="user-item online"
                onClick={() => handleUserClick(onlineUser)}
              >
                {onlineUser.name}
                <span className="status online"></span>
              </div>
            ))}
          </div>
        ) : (
          <p>No users online</p>
        )}
        {offlineUsers.length > 0 && (
          <>
            <h2 className="label">Offline</h2>
            {offlineUsers.map((offlineUser) => (
              <div
                key={offlineUser.id}
                className="user-item offline"
                onClick={() => handleUserClick(offlineUser)}
              >
                {offlineUser.name}
                <span className="status offline"></span>
              </div>
            ))}
          </>
        )}
      </div>
      <div id="chat-area">
        {selectedUser ? (
          <>
            <div id="messages">
              {messages.length > 0 ? (
                messages
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((message, index) => {
                    console.log("Skip user check:", skipUserCheck);
                    console.log("Message user:", message.user);
                    console.log("Current user ID:", user.id);

                    const messageClass = skipUserCheck
                      ? "message other-message" // Use "message other-message" if skipUserCheck is true
                      : message.user === user.id
                      ? "message my-message" // Otherwise, use "message my-message" if the message user matches the current user
                      : "message other-message"; // Default to "message other-message" if none of the above

                    return (
                      <div key={index} className={messageClass}>
                        {message.content}
                      </div>
                    );
                  })
              ) : (
                <p>No messages to display</p>
              )}
            </div>

            <div className="chat-message">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
