import { useRef } from "react";
import { hightlightsSlides } from "../constants";
import { useState } from "react";
import { useEffect } from "react";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  //Creating references to specic elements, so we can keep track of the video we're on
  const videoRef = useRef([]); //reference que l'on donne aux vidéos que l'on va voir dans chaque slide (c'est une array, car il y a plsrs 1 video pour chaque slide)
  const videoDivRef = useRef([]); //Container des points gris = videoSpanRef / Sert à référencé les vidéos ajoutés dans la progressbar et transformés en point gris
  const videoSpanRef = useRef([]); //Ref des points gris de la progressbar sous les  / Permet d'avoir une ligne blanche sur la ligne grise et créer une progress bar

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
  useGSAP(() => {
    //!!!!!!! Animation pour faire slider les videos, #slider = id de la div parent qui contient toutes les div où il y a les vidéos
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`, //id=0 ne bouge pas car 0*-100=0; puis à partir le id=1 donc 2eme video, il y aura une transition horizontale X
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video", //La video se lance quand on arrive à l'element avec id=video
        toggleActions: "restart none none none", //Quand on voit la video elle restart
      },
      onComplete: () => {
        //Quand on a complété la video
        setVideo((prev) => ({
          ...prev, //On spread les properties de la previous state de la video, pour pvr en faire une copie et changer les properties qu'on veut
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]); //to update stuff when the videoId changes + isEnd state value

  //!!!!!!:useEffect TO PLAY THE VIDEO, DEPENDING ON THE EXISTENCE OF THE STATE loadedData AND if it has a length > 3
  //explication: if we came to the end, and we're no longer playing the video THEN pause it ELSE, if it's playing THEN IF startPlay is ALSO true THEN we find a specic video we want to trigger, and we play it
  useEffect(() => {
    if (loadedData.length > 3) {
      //IF loadedData exists AND had a length > 3
      if (!isPlaying) {
        videoRef.current[videoId].pause(); //Pause the video
      } else if (startPlay) {
        videoRef.current[videoId].play(); //!!! PLAY THE VIDEO
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  //On va gérer la state loadedData pour lui donner une valeur = event we pass on it; et que les vidéos démarrent // event = event we pass into it when we call handleLoadedMetaData
  const handleLoadedMetaData = (index, event) =>
    setLoadedData((prevLoadedData) => [...prevLoadedData, event]);

  //!!!!! useEffect that will animates the progress bar of the video
  useEffect(() => {
    let currentProgress = 0;

    let span = videoSpanRef.current; //le point gris ciblé

    if (span[videoId]) {
      //to animate the progress of the video
      let anim = gsap.to(span[videoId], {
        //onUpdate= To make the progress white bar have the same duration than the time of the video
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100); //.progress() is directly built into Gsap which allows you to get the progress of the animation / *100 is to get a percent of the progress of the animation
          if (progress != currentProgress) {
            currentProgress = progress;
            gsap.to(videoDivRef.current[videoId], {
              //pour transformer le container du pointgris = videoDivRef, en progressBar
              width:
                window.innerWidth < 760 //for mobile
                  ? "10vw"
                  : window.innerWidth < 1200 //for tablets
                  ? "10vw"
                  : "4vw", //for laptops
            });
            //animation de la bar blanche sur la bar grise
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        //!!!! What will happen when the video completes: progressbar redevient un point et gris
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      //After clicking on reset button, and going back to the first video with id=0; we want the animation of the slides to restart
      if (videoId === 0) {
        anim.restart(); //utility handler given by gsap
      }

      //So that the duration of the white progressbar == the duration of the video that is playing
      const animUpdate = () => {
        anim.progress(
          //!!!!.currentTime/videoDuration est obligé pour que la progressbar blanche sache où en est la video et dure comme elle / videoDuration est une property de l'array highlightsSlides dans index.js de utils !!!!
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      //ticker is used to update the progress bar based on the animation of the video == pour que le code synchronise de manière plus précise le progression de la bar avec celle de la vidéo
      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }

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
      case "pause":
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
                  className={`${
                    e.id === 2 && "translate-x-44"
                  } pointer-events-none`} //Il a rajouté cette className pour la video avecl'id 2, car il a remarqué que c'est mieux pour cette vidéo (ne pas réfléchir sur ça)
                  ref={(element) => (videoRef.current[i] = element)} //we're find a specific index in the videoRef's array AND SETTING IT to this current video element
                  //onEnded Va servir à ce que l'animation de la progress bar blanche dure pareil que la vidéo en cours
                  onEnded={() => {
                    i !== 3 //= Si ce n'est pas la fin de la vidéo car il y a 4 video donc i va de 0 à 3
                      ? handleProcess("video-end", i) // we pass 'video-end' and a specific index so that we know which one will be end
                      : handleProcess("video-last"); //So we now we need to restart
                  }}
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

      {/* div qui va contenir la bar grise et bouton play/pause des videos du slide */}
      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {/* !!!!videoRef.current.map = we map on each video et on la transforme en point gris + on la rajoute dans l'array de videoDivRef */}
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(element) => (videoDivRef.current[i] = element)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              {/*!!!!videoSpanRef: pour plutard pouvoir créer une progressbar blanche sur la bar grise / On self-close le span s'il n'a pas de contenu */}
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
