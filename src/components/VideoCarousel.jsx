import { useRef } from "react";
import { hightlightsSlides } from "../constants";
import { useState } from "react";
import { useEffect } from "react";
import gsap from "gsap";

const VideoCarousel = () => {
  //Creating references to specic elements, so we can keep track of the video we're on
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  //Creatin a state to store the videos
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);

  //Now we destructure the values so we can use  them without writing video.isEnd but just isEnd
  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  //useEffect that will deal with the playing of the video
  //explication: if we came to the end, and we're no longer playing the video THEN pause it ELSE, if it's playing THEN IF startPlay is ALSO true THEN we find a specic video we want to trigger, and we play it
  useEffect(() => {
   if(loadedData.length>3) {
    if(!isPlaying) {
      videoRef.current[videoId].pause();
    } else {
      startPlay && videoRef.current[videoId].play();
    }
   }
  }, [startPlay, videoId, isPlaying, loadedData]);

  //useEffect that will animates the progress bar of the video
  useEffect(() => {
    const currentProgress = 0;
    let span = videoSpanRef.current;
    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        //onUpdate= what will happen once the animation updates
        onUpdate: () => {},
        //onUpdate= what will happen if the animation is complete
        onComplete: () => {},
      });
    }
  }, [videoId, startPlay]);

  return (
    <>
      {/*div qui contient le .map */}
      <div className="flex items-center">
        {/* () au lieu de {} après un .map, car on a qu'1 expression, donc pas la peine d'utiliser return. Si plusieurs expressions, on utilise {return...} */}
        {hightlightsSlides.map((e, i) => (

          //div pour chaque carré du slide donc pr-10 sépare les carrés du slide
          <div key={e.id} id="slider" className="sm:pr-20 pr-10">

            {/* div qui donne contenu pour chaque carré slide + dimension + position relative */}
            <div className="video-carousel_container">
              {/* div qui contient la video et le text */}
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                 id="video" 
                 preload="auto" 
                 playsInline={true} 
                 muted
                 ref={(element)=>(videoRef.current[i] = element)} //we're find a specific index in the videoRef's array AND SETTING IT to this current video element 
                 onPlay={()=>{//code a éxecuter lorsque la vidéo commence = we spread all the info about the video AND we set isPlaying to true
                  setVideo((prevVideo)=>({
                    ...prevVideo, isPlaying:true
                  }))
                 }}
                 >
                  <source src={e.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {/* 2eme .map NESTED dans le 1er .map pour map sur texlists = array dans objets de highlightsSlides*/}
                {e.textLists.map((e) => (
                  <p key={e} className="md:text-2xl text-xl font-medium">
                    {e}
                  </p>
                ))}
              </div>
            </div>
            
          </div>
        ))}
      </div>

      {/* div qui va contenir la progress bar et bouton play/pause des videos du slide */}
      <div>
        
      </div>
    </>
  );
};

export default VideoCarousel;
