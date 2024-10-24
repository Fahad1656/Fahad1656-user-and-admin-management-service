// import React, { useRef, useState, useEffect } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { useAuth } from "./context/AuthContext";
// import axios from "axios";

// const Publisher = () => {
//   const localVideoRef = useRef(null);
//   const client = useRef(null);
//   const [microphoneTrack, setMicrophoneTrack] = useState(null);
//   const [cameraTrack, setCameraTrack] = useState(null);
//   const [isMicMuted, setIsMicMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);

//   const API_URL = import.meta.env.VITE_API_URL;
//   const APP_ID = import.meta.env.VITE_APP_ID;
//   const CHANNEL_NAME = import.meta.env.VITE_CHANNEL_NAME;

//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/streaming/token`);
//         return response.data.token;
//       } catch (error) {
//         console.error("Error fetching token:", error);
//         return null;
//       }
//     };

//     const init = async () => {
//       try {
//         const token2 = await fetchToken();
//         console.log("Fetched Token:", token2);
       
//         client.current = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
//         client.current.setClientRole("host");

//         // Join the channel and capture the host's UID
//         const hostUid = await client.current.join(
//           APP_ID,
//           CHANNEL_NAME,
//           token2 || null,
//           null
//         );
       

//         // Automatically acquire recording resource after joining
//         await acquireRecordingResource(hostUid);

//         // Listen for other users joining the channel
//         client.current.on("user-joined", (user) => {
//           console.log("User joined:", user);
//           // Optionally handle other users
//         });

//         // Create and publish local tracks
//         const [micTrack, camTrack] =
//           await AgoraRTC.createMicrophoneAndCameraTracks().catch((error) => {
//             console.log("Failed to create tracks:", error);
//             return [];
//           });

//         if (camTrack) {
//           camTrack.play(localVideoRef.current);
//         }

//         setMicrophoneTrack(micTrack);
//         setCameraTrack(camTrack);

//         if (micTrack && camTrack) {
//           await client.current.publish([micTrack, camTrack]);
//           console.log("Published local tracks.");
//         }
//       } catch (error) {
//         console.log("Error during stream initialization:", error);
//       }
//     };

//     // Initialize the publisher
//     init();

//     // Cleanup on component unmount
//     return () => {
//       if (client.current) {
//         client.current.leave();
//         console.log("Left the channel.");
//       }
//     };
//   }, [API_URL, CHANNEL_NAME, APP_ID]);

//   // Function to acquire recording resource
//   const acquireRecordingResource = async (hostUid) => {
//     if (!hostUid) {
//       console.error(
//         "Host UID not available, cannot acquire recording resource."
//       );
//       return;
//     }
//   };

//   // const toggleMute = async () => {
//   //   if (microphoneTrack) {
//   //     if (isMicMuted) {
//   //       await microphoneTrack.setEnabled(true);
//   //     } else {
//   //       await microphoneTrack.setEnabled(false);
//   //     }
//   //     setIsMicMuted(!isMicMuted);
//   //   }
//   // };

//   // // Function to toggle video on/off
//   // const toggleVideo = async () => {
//   //   if (cameraTrack) {
//   //     if (isVideoOff) {
//   //       await cameraTrack.setEnabled(true);
//   //     } else {
//   //       await cameraTrack.setEnabled(false);
//   //     }
//   //     setIsVideoOff(!isVideoOff);
//   //   }
//   // };

//   return (
//     <>
//       <div
//         ref={localVideoRef}
//         style={{ width: "300px", height: "300px", backgroundColor: "blue" }}
//       />
//       {/* <div className="control-buttons">
//         <button onClick={toggleMute}>{isMicMuted ? "Unmute" : "Mute"}</button>
//         <button onClick={toggleVideo}>
//           {isVideoOff ? "Video On" : "Video Off"}
//         </button>
//       </div> */}
//     </>
//   );
// };

// export default Publisher;
import React, { useRef, useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";

const Publisher = () => {
  const localVideoRef = useRef(null);
  const client = useRef(null);
  const [microphoneTrack, setMicrophoneTrack] = useState(null);
  const [cameraTrack, setCameraTrack] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const APP_ID = import.meta.env.VITE_APP_ID;
  const CHANNEL_NAME = import.meta.env.VITE_CHANNEL_NAME;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/streaming/token`);
        return response.data.token;
      } catch (error) {
        console.error("Error fetching token:", error);
        return null;
      }
    };

    const init = async () => {
      try {
        const token2 = await fetchToken();
        console.log("Fetched Token:", token2);

        client.current = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        client.current.setClientRole("host");

        // Join the channel and capture the host's UID
        const hostUid = await client.current.join(
          APP_ID,
          CHANNEL_NAME,
          token2 || null,
          null
        );

        // Automatically acquire recording resource after joining
        await acquireRecordingResource(hostUid);

        // Create microphone and camera tracks with error handling
        const [micTrack, camTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks(
            {
              AEC: true, // Acoustic Echo Cancellation
              ANS: true, // Automatic Noise Suppression
              AGC: true, // Automatic Gain Control
            },
            {
              encoderConfig: "720p",
            }
          ).catch((error) => {
            console.error(
              "Failed to create microphone and camera tracks:",
              error
            );
            return [null, null];
          });

        // If camera track was created successfully, play the local video
        if (camTrack) {
          camTrack.play(localVideoRef.current);
          setCameraTrack(camTrack);
          console.log("Camera track initialized successfully.");
        } else {
          console.error("Camera track is not available.");
        }

        // Set the microphone track if available
        if (micTrack) {
          setMicrophoneTrack(micTrack);
          console.log("Microphone track initialized successfully.");
        } else {
          console.error("Microphone track is not available.");
        }

        // Publish tracks if available
        if (micTrack && camTrack) {
          await client.current.publish([micTrack, camTrack]);
          console.log("Published local tracks.");
        }
      } catch (error) {
        console.log("Error during stream initialization:", error);
      }
    };

    // Initialize the publisher
    init();

    // Cleanup on component unmount
    return () => {
      if (client.current) {
        client.current.leave();
        console.log("Left the channel.");
      }
      if (cameraTrack) {
        cameraTrack.stop();
        cameraTrack.close();
      }
      if (microphoneTrack) {
        microphoneTrack.stop();
        microphoneTrack.close();
      }
    };
  }, [API_URL, CHANNEL_NAME, APP_ID]);

  // Function to acquire recording resource
  const acquireRecordingResource = async (hostUid) => {
    if (!hostUid) {
      console.error(
        "Host UID not available, cannot acquire recording resource."
      );
      return;
    }
  };

  return (
    <>
      <div
        ref={localVideoRef}
        style={{ width: "300px", height: "300px", backgroundColor: "blue" }}
      />
    </>
  );
};

export default Publisher;
