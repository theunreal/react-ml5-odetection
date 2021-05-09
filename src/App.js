import React, { useEffect, useRef } from "react";
import "./App.scss";
import Webcam from "react-webcam";
import * as ml5 from "ml5";
import glasses from './glasses.png';

const App = () => {
    const videoRef = useRef();
    const canvasRef = useRef();
    const faceApi = useRef();

    useEffect(() => {

        const ctx = canvasRef.current.getContext('2d');
        const modelLoaded = () => {
            setInterval(() => {
                detect();
            }, 200);
        };

        const detectionOptions = {
            withLandmarks: true,
            withDescriptors: false,
        };

        const drawPart = (feature, closed = true) => {
            ctx.beginPath();
            for (let i = 0; i < feature.length; i += 1) {
                const x = feature[i]._x;
                const y = feature[i]._y;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            if (closed === true) {
                ctx.closePath();
            }
            ctx.stroke();
        };

        faceApi.current = ml5.faceApi(detectionOptions, modelLoaded);

        const detect = () => {
            if (videoRef.current.video.readyState !== 4) {
                return;
            }
            videoRef.current.video.width = 600;
            videoRef.current.video.height = 420;

            faceApi.current.detect(videoRef.current.video, (err, results) => {
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


                        Object.keys(detection.parts).forEach((part) => {
                            drawPart(detection.parts[part]);
                        });

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
