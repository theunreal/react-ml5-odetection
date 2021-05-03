import './App.css';
import React, { useRef } from 'react';
import Webcam from "react-webcam";
import * as ml5 from 'ml5';


function App() {

    const webcamRef = useRef();
    const objectDetector = useRef();

    React.useEffect(() => {

        const runCoco = () => {
            setInterval(() => {
                detect();
            }, 2000)
        };

        webcamRef.current.video.onloadeddata = () => {
            console.log('Loaded video!');
            runCoco();
        };
        objectDetector.current = ml5.objectDetector('cocossd', {}, modelLoaded);
    }, []);

    const modelLoaded = () => {
        console.log('Model loaded!');
    };


    const detect = () => {
        objectDetector.current.detect(webcamRef.current.video, (err, results) => {
            console.log(results); // Will output bounding boxes of detected objects
        });
    };

    return (
        <div className="App">
            <Webcam ref={webcamRef}/>
        </div>
    );
}

export default App;
