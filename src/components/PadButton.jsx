import React, { useState, useRef } from 'react';
import { useRecorder } from '../hooks/useRecorder';
import './PadButton.css';
import btnImg from '../assets/img/ボタン.png';

const PadButton = ({ id, isFixed, label, mode, audioUrl, onUpdateAudio }) => {
    const { isRecording, startRecording, stopRecording } = useRecorder();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Visual feedback for playing
    const triggerVisualPlay = () => {
        setIsPlaying(true);
        // Fixed sounds or quick feedback
        setTimeout(() => setIsPlaying(false), 200);
    };

    const handlePlay = () => {
        triggerVisualPlay();

        const soundToPlay = audioUrl;

        if (soundToPlay) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            audioRef.current = new Audio(soundToPlay);

            // For longer files, we might want to unset playing on end, but for pads typically we just flash
            // audioRef.current.onended = () => setIsPlaying(false);

            audioRef.current.onerror = (e) => {
                console.error("Audio playback error", e);
            };

            audioRef.current.play().catch(e => {
                console.error("Playback failed:", e);
            });
        }
    };

    const handleRecordStart = async () => {
        if (!isFixed && mode === 'record') {
            await startRecording();
        }
    };

    const handleRecordStop = async () => {
        if (!isFixed && mode === 'record' && isRecording) {
            const result = await stopRecording();
            if (result) {
                onUpdateAudio(id, result.audioUrl);
            }
        }
    };

    // Interaction Handlers
    const handleMouseDown = (e) => {
        if (isFixed || mode === 'play') {
            handlePlay();
        } else {
            handleRecordStart();
        }
    };

    const handleMouseUp = () => {
        handleRecordStop();
    };

    const handleMouseLeave = () => {
        handleRecordStop();
    };

    // Touch support
    const handleTouchStart = (e) => {
        if (e.cancelable) e.preventDefault();

        if (isFixed || mode === 'play') {
            handlePlay();
        } else {
            handleRecordStart();
        }
    };

    const handleTouchEnd = (e) => {
        if (e.cancelable) e.preventDefault();
        handleRecordStop();
    };

    // Classes
    const getClasses = () => {
        const classes = ['pad-btn'];
        if (isPlaying) classes.push('playing');
        if (isRecording) classes.push('recording');
        if (mode === 'record' && !isFixed) classes.push('record-mode-active');
        return classes.join(' ');
    };

    return (
        <div className="pad-container">
            <button
                className={getClasses()}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ '--btn-bg': `url(${btnImg})` }}
                title={label}
            >
                {/* No inner content, just background image */}
            </button>
            <div className="pad-label-container">
                {label}
            </div>
        </div>
    );
};

export default PadButton;
