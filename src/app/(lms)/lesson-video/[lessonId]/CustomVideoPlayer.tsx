// src/app/(lms)/lesson-video/[lessonId]/CustomVideoPlayer.tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaUndo,
  FaRedo,
} from "react-icons/fa";

import styles from "./CustomVideoPlayer.module.css";

export default function CustomVideoPlayer({
  src,
}: {
  src: string;
}) {
  const videoRef =
    useRef<HTMLVideoElement | null>(
      null
    );

  const playerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const hideTimeoutRef =
    useRef<NodeJS.Timeout | null>(
      null
    );

  const [playing, setPlaying] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(1);

  const [muted, setMuted] =
    useState(false);

  const [showControls, setShowControls] =
    useState(true);

  const [showPlayIcon, setShowPlayIcon] =
    useState(false);

  const [seekLeft, setSeekLeft] =
    useState(false);

  const [seekRight, setSeekRight] =
    useState(false);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  /* =========================
     VIDEO EVENTS
  ========================= */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    function updateDuration() {
      if (
        Number.isFinite(
          video.duration
        ) &&
        video.duration > 0
      ) {
        setDuration(
          video.duration
        );
      }
    }

    function updateProgress() {
      setProgress(
        video.currentTime || 0
      );
    }

    function onPlay() {
      setPlaying(true);
    }

    function onPause() {
      setPlaying(false);
    }

    video.addEventListener(
      "loadedmetadata",
      updateDuration
    );

    video.addEventListener(
      "durationchange",
      updateDuration
    );

    video.addEventListener(
      "loadeddata",
      updateDuration
    );

    video.addEventListener(
      "canplay",
      updateDuration
    );

    video.addEventListener(
      "timeupdate",
      updateProgress
    );

    video.addEventListener(
      "play",
      onPlay
    );

    video.addEventListener(
      "pause",
      onPause
    );

    return () => {
      video.removeEventListener(
        "loadedmetadata",
        updateDuration
      );

      video.removeEventListener(
        "durationchange",
        updateDuration
      );

      video.removeEventListener(
        "loadeddata",
        updateDuration
      );

      video.removeEventListener(
        "canplay",
        updateDuration
      );

      video.removeEventListener(
        "timeupdate",
        updateProgress
      );

      video.removeEventListener(
        "play",
        onPlay
      );

      video.removeEventListener(
        "pause",
        onPause
      );
    };
  }, []);

  /* =========================
     FULLSCREEN
  ========================= */

  useEffect(() => {
    function handleFullscreen() {
      setIsFullscreen(
        !!document.fullscreenElement
      );
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreen
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreen
      );
    };
  }, []);

  /* =========================
     PLAY / PAUSE
  ========================= */

  async function togglePlay() {
    if (!videoRef.current) return;

    try {
      if (playing) {
        videoRef.current.pause();

        setShowPlayIcon(true);
      } else {
        await videoRef.current.play();

        setShowPlayIcon(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /* =========================
     SEEK
  ========================= */

  function handleSeek(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!videoRef.current) return;

    const value = Number(
      e.target.value
    );

    const safeValue = Math.min(
      Math.max(value, 0),
      duration
    );

    videoRef.current.currentTime =
      safeValue;

    setProgress(safeValue);
  }

  function seekBackward() {
    if (!videoRef.current) return;

    videoRef.current.currentTime =
      Math.max(
        videoRef.current.currentTime -
          10,
        0
      );

    setSeekLeft(true);

    setTimeout(() => {
      setSeekLeft(false);
    }, 700);
  }

  function seekForward() {
    if (!videoRef.current) return;

    videoRef.current.currentTime =
      Math.min(
        videoRef.current.currentTime +
          10,
        duration
      );

    setSeekRight(true);

    setTimeout(() => {
      setSeekRight(false);
    }, 700);
  }

  /* =========================
     VOLUME
  ========================= */

  function handleVolume(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!videoRef.current) return;

    const value = Number(
      e.target.value
    );

    videoRef.current.volume = value;

    setVolume(value);

    if (value === 0) {
      videoRef.current.muted = true;

      setMuted(true);
    } else {
      videoRef.current.muted = false;

      setMuted(false);
    }
  }

  function toggleMute() {
    if (!videoRef.current) return;

    const nextMuted = !muted;

    videoRef.current.muted =
      nextMuted;

    setMuted(nextMuted);
  }

  /* =========================
     FORMAT TIME
  ========================= */

  function formatTime(
    seconds: number
  ) {
    if (
      !Number.isFinite(seconds)
    ) {
      return "00:00";
    }

    const hrs = Math.floor(
      seconds / 3600
    );

    const mins = Math.floor(
      (seconds % 3600) / 60
    );

    const secs = Math.floor(
      seconds % 60
    );

    if (hrs > 0) {
      return `${hrs}:${mins
        .toString()
        .padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  /* =========================
     FULLSCREEN
  ========================= */

  async function fullscreen() {
    if (!playerRef.current) return;

    try {
      if (
        !document.fullscreenElement
      ) {
        await playerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error(err);
    }
  }

  /* =========================
     CONTROLS UI
  ========================= */

  function showUI() {
    setShowControls(true);

    if (
      hideTimeoutRef.current
    ) {
      clearTimeout(
        hideTimeoutRef.current
      );
    }

    hideTimeoutRef.current =
      setTimeout(() => {
        setShowControls(false);
      }, 3000);
  }

  return (
    <div
      ref={playerRef}
      className={styles.player}
      onMouseMove={showUI}
    >
      {/* VIDEO */}

      <video
        ref={videoRef}
        src={src}
        className={styles.video}
        preload="metadata"
      />

      {/* CENTER CLICK */}

      <div
        className={styles.centerLayer}
        onClick={togglePlay}
      />

      {/* SEEK ZONES */}

      <div
        className={
          styles.seekLeftZone
        }
        onDoubleClick={
          seekBackward
        }
      />

      <div
        className={
          styles.seekRightZone
        }
        onDoubleClick={
          seekForward
        }
      />

      {/* BIG PLAY */}

      {showPlayIcon &&
        !playing && (
          <div
            className={
              styles.bigPlay
            }
          >
            <FaPlay />
          </div>
        )}

      {/* SEEK INDICATORS */}

      {seekLeft && (
        <div
          className={
            styles.seekIndicatorLeft
          }
        >
          <FaUndo />
          <span>10</span>
        </div>
      )}

      {seekRight && (
        <div
          className={
            styles.seekIndicatorRight
          }
        >
          <FaRedo />
          <span>10</span>
        </div>
      )}

      {/* CONTROLS */}

      <div
        className={`${styles.controls} ${
          showControls
            ? styles.controlsShow
            : styles.controlsHide
        }`}
      >
        {/* PROGRESS */}

        <input
          type="range"
          min={0}
          max={
            duration > 0
              ? duration
              : 0
          }
          step="0.01"
          value={progress}
          onChange={handleSeek}
          className={
            styles.progress
          }
        />

        <div
          className={
            styles.bottomControls
          }
        >
          <div
            className={
              styles.leftControls
            }
          >
            <button
              onClick={
                togglePlay
              }
              className={
                styles.iconBtn
              }
            >
              {playing ? (
                <FaPause />
              ) : (
                <FaPlay />
              )}
            </button>

            <span
              className={
                styles.time
              }
            >
              {formatTime(
                progress
              )}{" "}
              /{" "}
              {formatTime(
                duration
              )}
            </span>

            <button
              onClick={
                toggleMute
              }
              className={
                styles.iconBtn
              }
            >
              {muted ? (
                <FaVolumeMute />
              ) : (
                <FaVolumeUp />
              )}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={
                muted
                  ? 0
                  : volume
              }
              onChange={
                handleVolume
              }
              className={
                styles.volume
              }
            />
          </div>

          <div
            className={
              styles.rightControls
            }
          >
            <button
              onClick={
                fullscreen
              }
              className={
                styles.iconBtn
              }
            >
              {isFullscreen ? (
                <FaCompress />
              ) : (
                <FaExpand />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}