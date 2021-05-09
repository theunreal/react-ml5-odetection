import React, { useEffect, useRef } from "react";
import "./App.scss";
import Webcam from "react-webcam";
import * as ml5 from "ml5";
import glasses from './glasses.png';

const App = () => {
    const videoRef = useRef();
    const canvasRef = useRef();
    const objectDetector = useRef();

    useEffect(() => {

        const ctx = canvasRef.current.getContext('2d');
        const modelLoaded = () => {
            setInterval(() => {
                detect();
            }, 2000);
        };

        objectDetector.current = ml5.objectDetector('cocossd', modelLoaded);

        const detect = () => {
            if (videoRef.current.video.readyState !== 4) {
                return;
            }
            videoRef.current.video.width = 600;
            videoRef.current.video.height = 420;

            objectDetector.current.detect(videoRef.current.video, (err, results) => {
                const width = 600;
                const height = 420;
                canvasRef.current.width = width;
                canvasRef.current.height = height;
                console.log(results);
                if (results && results.length) {
                    results.forEach((detection) => {
                        console.log(detection);
                        ctx.beginPath();
                        ctx.fillStyle = "#FF0000";
                        ctx.rect(detection.x, detection.y, detection.width - 100, detection.height);
                        ctx.stroke();
                    });

                }
            });
        };

    }, []);



    return (
        <div className="container">
            <div className="webcam-video">
                <Webcam
                    ref={videoRef}
                    className="my"
                />
                <canvas ref={canvasRef} className="my" />
            </div>
        </div>
    );
};

export default App;
