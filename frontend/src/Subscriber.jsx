
import React, { useRef, useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useAuth } from "./context/AuthContext";
import axios from "axios";

const Subscriber = () => {
  const remoteVideoRef = useRef(null);
  const client = useRef(null);
  const [remoteAudioTrack, setRemoteAudioTrack] = useState(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [uid, setUid] = useState(null); // Store uid
  const [recordingResourceId, setRecordingResourceId] = useState("");
  const [sid, setSid] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const APP_ID = import.meta.env.VITE_APP_ID;
  const CHANNEL_NAME = import.meta.env.VITE_CHANNEL_NAME;
  const [TOKEN, setTOKEN] = useState(""); // Store token from API

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/streaming/subscriber/token`);
        setTOKEN(response.data.token);
        return response.data.token;
      } catch (error) {
        console.error("Error fetching token:", error);
        return null;
      }
    };

    const init = async () => {
      try {
        const token2 = await fetchToken();
        client.current = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        await client.current.join(APP_ID, CHANNEL_NAME, token2 || null, null);

        client.current.on("user-published", async (user, mediaType) => {
          await client.current.subscribe(user, mediaType);

          if (mediaType === "video") {
            const videoTrack = user.videoTrack;
            setRemoteVideoTrack(videoTrack);
            if (videoTrack && !isVideoOff) {
              videoTrack.play(remoteVideoRef.current);
            }
          }

          if (mediaType === "audio") {
            const audioTrack = user.audioTrack;
            setRemoteAudioTrack(audioTrack);
            if (audioTrack && !isAudioMuted) {
              audioTrack.play();
            }
          }

          console.log("User UID:", user.uid);
        });

        client.current.on("user-joined", (user) => {
          console.log("User joined:", user);
          setUid(user.uid);
        });

        client.current.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "video") {
            setRemoteVideoTrack(null);
          }
          if (mediaType === "audio") {
            setRemoteAudioTrack(null);
          }
        });
      } catch (error) {
        console.error("Error during audience stream initialization:", error);
      }
    };

    init();

    return () => {
      if (client.current) {
        client.current.leave();
      }
    };
  }, [isAudioMuted, isVideoOff]);

  // Start recording function
   const UID = String(uid);
  const startRecording = async () => {
    if (!uid) {
      console.error("UID not available, cannot start recording.");
      return;
    }

    try {
     
      const acquireResponse = await axios.post(`${API_URL}/streaming/acquire`, {
        cname: CHANNEL_NAME,
        uid: UID,
        clientRequest: {
          resourceExpiredHour: 24,
          scene: 0,
        },
      });

      const { resourceId } = acquireResponse.data;
      setRecordingResourceId(resourceId);

      const startResponse = await axios.post(`${API_URL}/streaming/start`, {
        channel: CHANNEL_NAME,
        resource: resourceId,
        uid: UID,
        token: TOKEN,
      });

      const { sid } = startResponse.data;
      setSid(sid);
      console.log("Recording started:", startResponse.data);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  // Stop recording function
  const stopRecording = async () => {
    try {
      const stopResponse = await axios.post(`${API_URL}/streaming/stop`, {
        channel: CHANNEL_NAME,
        uid: UID,
        sid: sid,
        mode:"mix",
        resourceId: recordingResourceId,
      });

      console.log("Recording stopped:", stopResponse.data);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const toggleAudio = () => {
    if (remoteAudioTrack) {
      if (isAudioMuted) {
        remoteAudioTrack.play();
      } else {
        remoteAudioTrack.stop();
      }
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (remoteVideoTrack) {
      if (isVideoOff) {
        remoteVideoTrack.play(remoteVideoRef.current);
      } else {
        remoteVideoTrack.stop();
      }
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <>
      <div
        ref={remoteVideoRef}
        style={{ width: "300px", height: "300px", backgroundColor: "blue" }}
      />
      <div className="control-buttons">
        <button onClick={toggleAudio}>
          {isAudioMuted ? "Unmute" : "Mute"}
        </button>
        <button onClick={toggleVideo}>
          {isVideoOff ? "Turn Video On" : "Turn Video Off"}
        </button>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
      </div>
    </>
  );
};

export default Subscriber;
