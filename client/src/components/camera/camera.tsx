import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import styles from "./styles.module.css";

const CameraComponent: React.FC = () => {

    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        handleCameraStop();
    };

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleCaptureStart = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setMediaStream(stream);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                console.log(mediaStream)
            } else {
                handleCaptureStart();
            }
        } catch (err) {
            console.error('Error accessing media devices: ', err);
        }
    };

    const handleCaptureImage = () => {
        if (videoRef.current) {
            // Capture image from video stream
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // Convert to base64 data URL
            const dataUrl = canvas.toDataURL('image/png');

            // Set the captured image
            setCapturedImage(dataUrl);


        }

        handleCameraStop();
    };

    const handleRetake = () => {
        setCapturedImage(null);
        handleCaptureStart();
        // if (mediaStream) {
        //     // mediaStream.getTracks().forEach(track => track.stop());
        //     setMediaStream(null);

        // }
    };


    const handleCameraChange = async () => {
        if (mediaStream) {
            const videoTracks = mediaStream.getVideoTracks();
            if (videoTracks.length > 0) {
                const currentTrack = videoTracks[0];
                const facingMode = currentTrack.getSettings().facingMode;
                const newFacingMode = facingMode === 'user' ? 'environment' : 'user';

                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: newFacingMode } });
                    setMediaStream(stream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error('Error accessing media devices: ', err);
                }
            }
        }
    };

    const handleCameraStop = () => {
        if (mediaStream) {
            console.log(mediaStream)
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
            console.log(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    };

    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<MediaDeviceInfo | null>(null);
    // const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Get list of available cameras
        checkCameras();
    }, []);

    const checkCameras = () => {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const cams = devices.filter(device => device.kind === 'videoinput');
            setCameras(cams);
            setSelectedCamera(cams[0]); // Select the first camera by default
        });
    }

    // useEffect(() => {
    //     // Start streaming video from selected camera
    //     if (selectedCamera && videoRef.current) {
    //         navigator.mediaDevices
    //             .getUserMedia({
    //                 video: {
    //                     deviceId: selectedCamera.deviceId,
    //                 },
    //             })
    //             .then(stream => {
    //                 if (videoRef.current) {
    //                     videoRef.current.srcObject = stream;
    //                 }
    //             })
    //             .catch(error => console.error('Error accessing media devices: ', error));
    //     }
    // }, [selectedCamera]);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [filePreview, setFilePreview] = useState<string | null>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            setFilePreview(previewUrl);
        }
    };



    // const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedDeviceId = event.target.value;
    //     const selectedCam = cameras.find(cam => cam.deviceId === selectedDeviceId);
    //     setSelectedCamera(selectedCam || null);
    // };

    // const handleStream = () => {
    //     if (videoRef.current && selectedCamera) {
    //         const stream = videoRef.current.srcObject as MediaStream;
    //         const socket = new WebSocket('ws://your-backend-url'); // Replace with your backend WebSocket URL

    //         socket.onopen = () => {
    //             console.log('Connected to WebSocket');
    //             const mediaRecorder = new MediaRecorder(stream);

    //             mediaRecorder.ondataavailable = event => {
    //                 if (event.data.size > 0) {
    //                     socket.send(event.data);
    //                 }
    //             };

    //             mediaRecorder.start();
    //         };

    //         socket.onerror = error => {
    //             console.error('WebSocket error:', error);
    //         };
    //     }
    // };

    return (
        <div className={styles.container}>
            <Tabs value={value} onChange={handleChange} >
                <Tab icon={<UploadFileIcon />} iconPosition="start" label="Upload Image or Video" />
                <Tab icon={<CameraAltIcon />} iconPosition="start" label="Capture a Image" />
                <Tab icon={<VideoCameraBackIcon />} iconPosition="start" label="Real Time Detection" />
            </Tabs>

            {value == 0 && (
                <>
                    <input type="file" accept="image/*, video/*" onChange={handleFileChange} />
                    {selectedFile && (
                        <div>
                            <p>Selected File: {selectedFile.name}</p>
                            <p>Type: {selectedFile.type}</p>
                            {filePreview && selectedFile.type.startsWith('image') && (
                                <img src={filePreview} alt="Selected" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                            )}
                        </div>
                    )}
                </>
            )}

            {value == 1 && (
                <>
                    <div>
                        {!capturedImage && (
                            <div>
                                <button onClick={handleCaptureStart}>Open Camera</button>
                                <select onChange={handleCameraChange}>
                                    {cameras.map((camera, index) => (
                                        <option key={index} value={camera.deviceId}>
                                            {camera.label || `Camera ${index + 1}`}
                                        </option>
                                    ))}
                                </select>
                                {mediaStream && (
                                    <div>
                                        <button onClick={handleCaptureImage}>Capture</button>
                                        <video ref={videoRef} autoPlay playsInline style={{ maxWidth: '100%', maxHeight: '400px' }} />
                                    </div>
                                )}
                            </div>
                        )}
                        {capturedImage && (
                            <div>
                                <img src={capturedImage} alt="Captured" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                                <button onClick={handleRetake}>Retake</button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>

        // <div className={styles.container}>
        //     <h2>Upload Image or Video</h2>
        //     <input type="file" accept="image/*, video/*" onChange={handleFileChange} />
        //     {selectedFile && (
        //         <div>
        //             <p>Selected File: {selectedFile.name}</p>
        //             <p>Type: {selectedFile.type}</p>
        //             {filePreview && selectedFile.type.startsWith('image') && (
        //                 <img src={filePreview} alt="Selected" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        //             )}
        //         </div>
        //     )}
        //     OR
        //     <select onChange={handleCameraChange}>
        //         {cameras.map((camera, index) => (
        //             <option key={index} value={camera.deviceId}>
        //                 {camera.label || `Camera ${index + 1}`}
        //             </option>
        //         ))}
        //     </select>
        //     <button onClick={handleStream}>Start Streaming</button>
        //     <br />
        //     <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', maxHeight: '400px' }} />
        // </div>
    );
};

export default CameraComponent;
