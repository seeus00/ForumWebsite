import React, { useEffect, useRef, useState } from 'react';

import zyzzImage from '../assets/zyzz_pic_1.jpeg';

import useWindowDimensions from '../hooks/useWindowDimensions';

import './musicPlayer.css';

interface ImgObj {
  img: HTMLImageElement
  x: number,
  y: number
}

export default function MusicPlayer() {
    const [images, setImages] = useState<ImgObj[]>();
    const [isSongPlaying, setIsSongPlaying] = useState(false);

    let { width, height } = useWindowDimensions();

    const canvasRef = useRef<any>();

    const zyzzMusic = require('../assets/songs/zyzz_1.mp3');


    const startAnimation = (time: DOMHighResTimeStamp) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!canvas || !context || !images) return;

        if (width === null) width = 0;
        if (height === null) height = 0;



        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < images.length; i++) {
          context.setTransform(0.5, 0, 0, 0.5, images[i].x, images[i].y);
          context.rotate(time / 500);
          context.drawImage(images[i].img, -images[i].img.width / 2, -images[i].img.height / 2);

          context.setTransform(1, 0, 0, 1, 0, 0);
        }

        requestAnimationFrame(startAnimation);
    }

    const handleClick = async () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')
        
        if (width === null) width = 0;
        if (height === null) height = 0;

        context.canvas.width = width;
        context.canvas.height = height;

        let imgs: ImgObj[] = [];

        //Draw 10 spinning zyzz images
        for (let i = 0; i < 20; i++) {
          const img = new Image();
          img.className = 'rotate';
          img.src = zyzzImage;

          const randX = Math.floor(Math.random() * width) + 1;
          const randY = Math.floor(Math.random() * height) + 1;
          imgs.push({
            img: img,
            x: randX,
            y: randY
          });
        }
        setImages(imgs);
    }

    // useEffect(() => {
    //   console.log("PLAYING");
    //   audioRef.current.play();
    // }, [isSongPlaying])

    useEffect(() => {
      if (!images) return;

      let audio = (document.getElementById("musicPlayer") as HTMLAudioElement);
      if (audio !== null) {
        audio.volume = 0.7;
        audio.play();
      }
     

      requestAnimationFrame(startAnimation);
    }, [images]);
      
    return (<div>
      <canvas ref={canvasRef}/>
      <button onClick={handleClick} style={{ background: require('../assets/zyzz_pic_1.jpeg') }}>CLICK TO HONOR ZYZZ NIGGA</button>
      <audio id="musicPlayer" src={zyzzMusic}></audio>
    </div>)
}