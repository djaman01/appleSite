import { hightlightsSlides } from "../constants";

const VideoCarousel = () => {
  return (
    <>
      <div className="flex items-center">
        {/* () au lieu de {} après un .map, car on a qu'1 expression, donc pas la peine d'utiliser return. Si plusieurs expressions, on utilise {return...} */}
        {hightlightsSlides.map((e, i) => (
          <div key={e.id} id="slider" className="sm:pr-20 pr-10">
            {/* pr-10 est fait pour ne pas voir le 2eme slide tant que le 1er n'est pas fini, puis on slide */}
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                {/* Pour qu'une video se lance, il faut obligatoirement mettre ces attributes dans <video> opening tag / preload="auto" => N'active pas la video MAIS Browser will preload the entire video file when the page loads, or as much as it can without delaying the other resources on the page*/}
                <video id="video" preload="auto" playsInline={true} muted>
                  <source src={e.video} type="video/mp4" />
                </video>
              </div>
              {/* Ce div va permettre au carousel de Slide */}
              <div className="absolute top-12 left-[5%] z-10">
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default VideoCarousel;
