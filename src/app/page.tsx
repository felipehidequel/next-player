"use client";

import { useState, useRef } from "react";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { TbPlayerSkipBackFilled, TbPlayerSkipForwardFilled } from "react-icons/tb";
import Button from "./button";

export default function Home() {
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const playPauseHandler = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  // Function to skip back
  const skipBackHandler = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  // Function to skip forward
  const skipForwardHandler = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
        <video
          ref={videoRef}
          src="/assets/video.mp4"
          className="rounded-md shadow"
          width="400"
          controls={false}
        />
        <div className="gap-4 flex items-center mt-4">
          <Button func={skipBackHandler}>
            {<TbPlayerSkipBackFilled />}
          </Button>

          <Button func={playPauseHandler}>
            {playing ? <CiPause1 /> : <CiPlay1 />}
          </Button>

          <Button func={skipForwardHandler}>
            {<TbPlayerSkipForwardFilled />}
          </Button>
        </div>
      </div>
    </div>
  );
}
