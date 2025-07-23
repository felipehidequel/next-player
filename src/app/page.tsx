"use client";

import { useState, useRef, useEffect } from "react";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import {
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from "react-icons/tb";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import Button from "./button";
import videos from "./data/VideoList";

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = videos[currentVideoIndex].src;
    video.load();

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => {
      if (!isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleEnded = () => {
      setPlaying(false);
      setCurrentVideoIndex((prevIndex) =>
        prevIndex === videos.length - 1 ? 0 : prevIndex + 1
      );
    };

    // Reset estados
    setCurrentTime(0);
    setDuration(0);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => setPlaying(true)).catch(() => setPlaying(false));
    }

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentVideoIndex]);


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
    if (videoRef.current) videoRef.current.currentTime -= 10;
  };

  const skipForwardHandler = () => {
    if (videoRef.current) videoRef.current.currentTime += 10;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = Number(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (videoRef.current) videoRef.current.muted = newMuted;
    if (!newMuted && volume === 0) {
      setVolume(0.5);
      if (videoRef.current) videoRef.current.volume = 0.5;
    }
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <main className="w-screen h-screen bg-gray-900 flex justify-center items-center p-8 gap-8 font-sans">
      {/* Coluna da Playlist */}
      <div className="flex flex-col w-[350px] h-[80vh] bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-white text-xl font-bold mb-4 px-2">Playlist</h2>
        <div className="flex-grow overflow-y-auto pr-2">
          {videos.map((video, index) => (
            <button
              key={video.id}
              className={`w-full flex items-center gap-4 p-2 rounded-md text-left transition-colors duration-200 ${currentVideoIndex === index
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
                }`}
              onClick={() => handleVideoSelect(index)}
            >
              <img
                src={video.image}
                alt={video.description}
                className="w-24 h-14 rounded object-cover"
              />
              <h3 className="text-white font-semibold text-sm">
                {video.description}
              </h3>
            </button>
          ))}
        </div>
      </div>

      {/* Coluna do Player */}
      <div className="flex flex-col items-center justify-center bg-gray-800 rounded-2xl shadow-lg p-6 w-[560px]">
        <video
          ref={videoRef}
          className="rounded-lg w-full"
          controls={false}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {/* Controles */}
        <div className="w-full mt-4 text-white">
          {/* Barra de Progresso e Tempo */}
          <div className="flex items-center gap-2">
            <span className="text-xs">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={isNaN(duration) || duration === 0 ? 1 : duration}
              value={currentTime}
              step="0.1"
              onChange={handleSeek}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-xs">{formatTime(duration)}</span>
          </div>

          {/* Botões Principais e Volume */}
          <div className="flex justify-between pad-4 items-center mt-2">
            <div className="flex items-center gap-2 w-1/3">
              <Button func={toggleMute}>
                {muted || volume === 0 ? (
                  <HiSpeakerXMark />
                ) : (
                  <HiSpeakerWave />
                )}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="flex items-center justify-center gap-4 w-1/3">
              <Button func={skipBackHandler}>
                <TbPlayerSkipBackFilled />
              </Button>
              <Button func={playPauseHandler}>
                {playing ? <CiPause1 size={30} /> : <CiPlay1 size={30} />}
              </Button>
              <Button func={skipForwardHandler}>
                <TbPlayerSkipForwardFilled />
              </Button>
            </div>

            <div className="w-1/3" />
          </div>
        </div>
      </div>
    </main>
  );
}
