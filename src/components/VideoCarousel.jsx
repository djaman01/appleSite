import { useRef } from "react";
import { hightlightsSlides } from "../constants";
import { useState } from "react";
import { useEffect } from "react";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";

const VideoCarousel = () => {
  //Creating references to specic elements, so we can keep track of the video we're on
  const videoRef = useRef([]); //reference que l'on donne aux vidéos que l'on va voir dans chaque slide (c'est une array, car il y a plsrs 1 video pour chaque slide)
  const videoDivRef = useRef([]); //Pour référencé les vidéos ajoutés dans la progressbar et transformés en point gris
  const videoSpanRef = useRef([]); //Pour référencés les vidéos ajoutés dans la progressBar et pour le span nesté dans le span du videoDivRef et transformés le point gris en trait avec durée vidéo

  //Creatin a state to store the videos qui auront des attributs qu'on va utilsier dans le code, par exemple: faire apparaitre bouton pause si isPlaying == false
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  //!!!!!Ce sont ces states qui vont nous permettre de start les vidéos du slide
  //!!!!!Car le useEffect qui controle le départ des vidéos, a pour condition de départ l'existence de la state loadedData, qui doit avoir un length >3
  const [loadedData, setLoadedData] = useState([]);

  //Now we destructure the values so we can use  them without writing video.isEnd but just isEnd
  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  //!!!!Using gsap to program the videos in the slide to play WHEN THEY ARE IN THE VIEW (quand on les voient sur la page)
  useGSAP(()=>{
    gsap.to('#video', {
      scrollTrigger: {
        trigger:'#video',//La video se lance quand on arrive à l'element avec id=video
        toggleActions: 'restart none none none' //Quand on voit la video elle restart
      },
      onComplete: ()=>{ //Quand on a complété la video
        setVideo((prev)=>({
          ...prev, //On spread les properties de la previous state de la video, pour pvr en faire une copie et changer les properties qu'on veut
          startPlay:true,
          isPlaying:true,
        }))
      }
    })
  },[isEnd, videoId]) //to update stuff when the videoId changes + isEnd state value



  //!!!!!!:useEffect TO PLAY THE VIDEO, DEPENDING ON THE EXISTENCE OF THE STATE loadedData AND if it has a length > 3
  //explication: if we came to the end, and we're no longer playing the video THEN pause it ELSE, if it's playing THEN IF startPlay is ALSO true THEN we find a specic video we want to trigger, and we play it
  useEffect(() => {
    if (loadedData.length > 3) {//IF loadedData exists AND had a length > 3
      if (!isPlaying) {
        videoRef.current[videoId].pause(); //Pause the video
      } else if(startPlay) {
        videoRef.current[videoId].play(); //!!! PLAY THE VIDEO
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  //On va gérer la state loadedData pour lui donner une valeur = event we pass on it; et que les vidéos démarrent // event = event we pass into it when we call handleLoadedMetaData
  const handleLoadedMetaData = (index, event) => setLoadedData((prevLoadedData) => [...prevLoadedData, event])

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

  //Function à appeler quand on clique sur le play/pause/reset bouton du slide / paramètres: type = type of action we click on: play/pause/reset
  //Comme il y a pleins de cas, on va utiliser "switch" statement au lieu de if/elseIf
  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end": //si type='video-end'== end of the video, on spread les value de la prevues videos et on change les valeurs de isEnd et videoId
        setVideo((prevVideo) => ({
          ...prevVideo, //On utilise le spread opeartor, pour pouvoir modifier les values des properties de la prevVideo
          isEnd: true,
          videoId: i + 1,
        }));
        break;
      case "video-last": //si type='video-last'== last video
        setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: true }));
        break;
      case "video-reset": //on va reset le videoId à 0, pour rejouer la video
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: false,
          videoId: 0,
        }));
        break;
      case "play":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;

      default:
        return video; //state variable qui contient les videos et les properties ci-dessu
    }
  };

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
                  ref={(element) => (videoRef.current[i] = element)} //we're find a specific index in the videoRef's array AND SETTING IT to this current video element
                  onPlay={() => {
                    //code a éxecuter lorsque la vidéo commence = we spread all the info about the video AND we set isPlaying to true
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  //onLoadedMetadata will call handleLoadedMetaData that will call setLoadedData THEN the useEffect with loadedData state will trigger the video Play
                  onLoadedMetadata={(event) => handleLoadedMetaData(i, event)} //onLoadedMetadata= This will get triggered once the Meta data of the video had loaded (=id, playsInline, preLoad ..etc bred, la data) Puis on y passe l'index de la vdieo et l'event
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
      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {/* videoRef.current.map = we map on each video et on la transforme en point gris + on la rajoute dans l'array de videoDivRef */}
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(element) => (videoDivRef.current[i] = element)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              {/* On self-close le span s'il n'a pas de contenu */}
              <span
                className="absolute h-full w-full rounded-full"
                ref={(element) => (videoSpanRef.current[i] = element)}
              />
            </span>
          ))}
        </div>
        {/* Bouton play/pause/replay */}
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
