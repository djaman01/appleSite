import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { heroVideo, smallHeroVideo } from "../utils";
import { useState } from "react";
import { useEffect } from "react";

const Hero = () => {
  //State variable qui va contenir PAR DEFAUT soit la video en grand format 'heroVideo', soit la video en petit format 'smallHeroVideo', en fonction de la taille de l'écran (760= 760px)
  const [videoSrc, setVideoSrc] = useState(
    window.innerWidth < 760 ? smallHeroVideo : heroVideo
  );

  //To dynamically modify the videoSrc state value, depending on the width of the screen: donc quand on resize the screen
  const handleVideoSrcSet = () => {
    window.innerWidth < 760
      ? setVideoSrc(smallHeroVideo)
      : setVideoSrc(heroVideo);
  };
  //Pour que le format de la video change dès qu'on actualise la page
  useEffect(() => {
    window.addEventListener("resize", handleVideoSrcSet); //=Whenever we resize the screen, we call the handleVideoSrcSet
    //In react it's important to clean up our event listeners to avois memory leaks or unexpected behavior
    return () => {
      window.removeEventListener("resize", handleVideoSrcSet);
    };
  }, []);

  useGSAP(() => {
    gsap.to("#hero", {
      opacity: 1,
      delay: 2
    });

    gsap.to("#cta", {
      opacity: 1,
      y: -50,
      delay: 2.2
    })
  }, []); //[] = quand l'animation va se déclencher: si vide = dès qu'on actualise la page


  
  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <p id="hero" className="hero-title">
          iPhone 15 Pro
        </p>
        <div className="md:w-10/12 w-9/12">
          {/* playsInline={true} => the video will play within the bounds of the element containing it, instead of taking over the entire screen when it starts playing, when we go full screen mode */}
          {/* className="pointer-events-none" => This means that the element will not respond to mouse events such as clicks, hover, or focus. It makes the element "unclickable" and "unselectable". */}
          <video
            className="pointer-events-none"
            autoPlay
            muted
            playsInline={true}
            key={videoSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>

      {/*cta = call to action */}
      <div
        id="cta"
        className="flex flex-col items-center opacity-0 translate-y-20"
      >
        <a href="#highlights" className="btn">Buy</a> 
        <p className="front-normal text-xl">From 1990Dhs/month or 9990Dhs </p>
      </div>
    </section>
  );
};

export default Hero;
