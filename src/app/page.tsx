"use client";

import { useState, useRef, useEffect } from "react";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import {
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from "react-icons/tb";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import Button from "./button";

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const playPauseHandler = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const skipBackHandler = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10
      );
    }
  };

  const skipForwardHandler = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
    }
  };

  const configCurrentTime = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = false;
    }
    setVolume(vol);
    setMuted(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center w-[420px]">
        <video
          ref={videoRef}
          src="/assets/video.mp4"
          className="rounded-md shadow"
          width="400"
          controls={false}
        />

        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => configCurrentTime(Number(e.target.value))}
          className="w-full mt-4"
        />

        <div className="gap-4 flex items-center mt-4">
          <Button func={skipBackHandler}>
            <TbPlayerSkipBackFilled />
          </Button>

          <Button func={playPauseHandler}>
            {playing ? <CiPause1 /> : <CiPlay1 />}
          </Button>

          <Button func={skipForwardHandler}>
            <TbPlayerSkipForwardFilled />
          </Button>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <Button func={toggleMute}>
            {muted || volume === 0 ? <HiSpeakerXMark /> : <HiSpeakerWave />}
          </Button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}
