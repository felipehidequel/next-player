"use client";

import { useState } from "react";
import { useRef } from 'react';
import { CiPlay1 } from "react-icons/ci";
import { CiPause1 } from "react-icons/ci";


export default function Home() {
  const [playing, setPlaying] = useState<boolean>(true);
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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center h-screen">
        <video
          ref={videoRef}
          src="assets/video.mp4"
          width="600"
          controls={false}
          autoPlay={playing}
        />
        <button onClick={playPauseHandler} className="mt-4 p-2 bg-blue-500 text-white rounded text-4xl">
          {playing ? <CiPause1 /> : <CiPlay1 />}
        </button>
      </div>
    </div>
  );
}