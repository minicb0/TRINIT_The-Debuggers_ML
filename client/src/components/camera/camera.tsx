import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import ReplayIcon from '@mui/icons-material/Replay';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styles from "./styles.module.css";

const CameraComponent: React.FC = () => {

    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [mediaStream1, setMediaStream1] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoRef1 = useRef<HTMLVideoElement>(null);
    const [isCameraOn1, setIsCameraOn1] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);

    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<number>(0);
    const [selectedCameraName, setSelectedCameraName] = useState<string>('');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [filePreview, setFilePreview] = useState<string | null>(null);

    // const [mediaStream, setMediaStream] = useState(null);

    //   const videoRef = useRef(null);

    const handleToggleCamera = async () => {
        if (!isCameraOn) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setMediaStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                } else {
                    handleToggleCamera();
                }
                setIsCameraOn(true);
            } catch (err) {
                console.error('Error accessing media devices: ', err);
            }
        } else {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
                setMediaStream(null);
                setIsCameraOn(false);
            }
        }
    };
    const handleToggleCamera1 = async () => {
        if (!isCameraOn1) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setMediaStream1(stream);
                if (videoRef1.current) {
                    videoRef1.current.srcObject = stream;
                } else {
                    handleToggleCamera1();
                }
                setIsCameraOn1(true);
            } catch (err) {
                console.error('Error accessing media devices: ', err);
            }
        } else {
            if (mediaStream1) {
                mediaStream1.getTracks().forEach(track => track.stop());
                setMediaStream1(null);
                setIsCameraOn1(false);
            }
        }
    };


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

    const handleCaptureStart1 = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setMediaStream1(stream);

            if (videoRef1.current) {
                videoRef1.current.srcObject = stream;
            } else {
                handleCaptureStart1();
            }
        } catch (err) {
            console.error('Error accessing media devices: ', err);
        }
    };

    const handleCaptureImage1 = () => {
        if (videoRef1.current) {
            // Capture image from video stream
            const canvas = document.createElement('canvas');
            canvas.width = videoRef1.current.videoWidth;
            canvas.height = videoRef1.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef1.current, 0, 0, canvas.width, canvas.height);

            // Convert to base64 data URL
            const dataUrl = canvas.toDataURL('image/png');

            // Set the captured image
            setCapturedImage(dataUrl);


        }

        handleCameraStop();
    };

    const handleRetake = () => {
        setCapturedImage(null);
        handleCaptureStart1();
        // if (mediaStream) {
        //     // mediaStream.getTracks().forEach(track => track.stop());
        //     setMediaStream(null);

        // }
    };


    const handleCameraChange = async (event: SelectChangeEvent) => {
        // console.log(cameras[parseInt(event.target.value)].label)
        // setSelectedCamera(parseInt(event.target.data-index));
        setSelectedCameraName(event.target.value)
        // if (mediaStream) {
        //     const videoTracks = mediaStream.getVideoTracks();

        //     if (videoTracks.length > 0) {
        //         const currentTrack = videoTracks[0];
        //         const facingMode = currentTrack.getSettings().facingMode;
        //         const newFacingMode = facingMode === 'user' ? 'environment' : 'user';

        //         try {
        //             const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: newFacingMode } });
        //             setMediaStream(stream);
        //             if (videoRef.current) {
        //                 videoRef.current.srcObject = stream;
        //             }
        //             console.log(event)
        //             setSelectedCamera(event.target.value);
        //         } catch (err) {
        //             console.error('Error accessing media devices: ', err);
        //         }
        //     }
        // }
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
        if (mediaStream1) {
            console.log(mediaStream)
            mediaStream1.getTracks().forEach(track => track.stop());
            setMediaStream1(null);
            console.log(mediaStream1)
            if (videoRef1.current) {
                videoRef1.current.srcObject = null;
            }
        }
    };


    // const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Get list of available cameras
        checkCameras();
    }, []);

    const checkCameras = () => {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const cams = devices.filter(device => device.kind === 'videoinput');
            setCameras(cams);

            if (cams.length > 0) {
                setSelectedCamera(0);
                setSelectedCameraName(cams[0].label)
            } else {
                setSelectedCamera(-1);
                setSelectedCameraName('')
            }
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
                    <input className={styles.inputFile} type="file" accept="image/*, video/*" onChange={handleFileChange} />
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
                            <>
                                <div className={styles.value2Div}>
                                    {!isCameraOn1 && (
                                        <>
                                            <button onClick={handleToggleCamera1} className={styles.green}>
                                                <div className={styles.flex}>
                                                    Start Camera
                                                    <RadioButtonCheckedIcon />
                                                </div>
                                            </button>
                                        </>
                                    )}
                                    {isCameraOn1 && (
                                        <>
                                            <button onClick={handleToggleCamera1} className={styles.red}>
                                                <div className={styles.flex}>
                                                    Stop Camera
                                                    <StopCircleIcon />
                                                </div>
                                            </button>

                                        </>
                                    )}
                                    <FormControl className={styles.camerainput}>
                                        <InputLabel id="camerainput2">Camera Input</InputLabel>
                                        <Select
                                            labelId="camerainput2"
                                            value={selectedCameraName}
                                            label="Camera Input"
                                            onChange={handleCameraChange}
                                        >
                                            {cameras.map((camera, index) => (
                                                <MenuItem data-index={index} key={index} value={camera.label || `Camera ${index + 1}`}>{camera.label || `Camera ${index + 1}`}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                </div>
                                <div>
                                    {mediaStream1 && (
                                        <div>
                                            <div className={styles.video}>
                                                <video ref={videoRef1} autoPlay playsInline />
                                            </div>
                                            <button onClick={handleCaptureImage1} className={styles.blue}>
                                                <div className={styles.flex}>
                                                    Capture Image
                                                    <FilterCenterFocusIcon />
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {capturedImage && (
                            <>
                                <div className={styles.value2Div}>
                                    <img className={styles.capturedImg} src={capturedImage} alt="Captured" />
                                </div>
                                <div className={styles.buttons2div}>
                                    <button onClick={handleRetake} className={styles.red}>
                                        <div className={styles.flex}>
                                            Retake Image
                                            <ReplayIcon />
                                        </div>
                                    </button>
                                    <button onClick={handleRetake} className={styles.green}>
                                        <div className={styles.flex}>
                                            Upload Image
                                            <CloudUploadIcon />
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {value == 2 && (
                <>
                    <div className={styles.value2Div}>
                        {!isCameraOn && (
                            <>
                                <button onClick={handleToggleCamera} className={styles.green}>
                                    <div className={styles.flex}>
                                        Start Camera
                                        <RadioButtonCheckedIcon />
                                    </div>
                                </button>
                            </>
                        )}
                        {isCameraOn && (
                            <>
                                <button onClick={handleToggleCamera} className={styles.red}>
                                    <div className={styles.flex}>
                                        Stop Camera
                                        <StopCircleIcon />
                                    </div>
                                </button>

                            </>
                        )}
                        <FormControl className={styles.camerainput}>
                            <InputLabel id="camerainput">Camera Input</InputLabel>
                            <Select
                                labelId="camerainput"
                                value={selectedCameraName}
                                label="Camera Input"
                                onChange={handleCameraChange}
                            >
                                {cameras.map((camera, index) => (
                                    <MenuItem data-index={index} key={index} value={camera.label || `Camera ${index + 1}`}>{camera.label || `Camera ${index + 1}`}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    {isCameraOn && (
                        <div className={styles.video} >
                            <video ref={videoRef} autoPlay playsInline />
                        </div>
                    )}
                </>
            )}
        </div>

    );
};

export default CameraComponent;
