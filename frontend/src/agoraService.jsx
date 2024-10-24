import React, { useState } from "react";
import Publisher from "./Publisher";
import Subscriber from "./Subscriber";

const AgoraService = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  return (
    <div>
      {isJoined ? (
        isCreator ? (
          <Publisher />
        ) : (
          <Subscriber />
        )
      ) : (
        <div>
          <button
            onClick={() => {
              setIsJoined(true);
              setIsCreator(true);
            }}
          >
            Create Channel
          </button>
          <button
            onClick={() => {
              setIsJoined(true);
              setIsCreator(false);
            }}
          >
            Join Channel
          </button>
        </div>
      )}
    </div>
  );
};

export default AgoraService;
