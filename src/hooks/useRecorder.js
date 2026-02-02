import { useState, useRef } from 'react';

export const useRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            throw err;
        }
    };

    const stopRecording = () => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current) return resolve(null);

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // Stop all tracks to release microphone
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
                
                setIsRecording(false);
                resolve({ audioBlob, audioUrl });
            };
            
            if (mediaRecorderRef.current.state !== 'inactive') {
               mediaRecorderRef.current.stop();
            }
        });
    };

    return { isRecording, startRecording, stopRecording };
};
