import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TheModel from "./TheModel";
import { useRef, useState } from "react";
import { yellowImg } from "../utils";

gsap.registerPlugin(ScrollTrigger);

//HERE WE'LL USE THREE.JS LIBRARY FOR REACT
const Imodel = () => {
  useGSAP(() => {
    gsap.to("#heading", {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: "#heading",
        start: "top bottom",
      },
    });
  }, []);

  //To choose if we want to look at the small or big iphone 3D Model
  const [size, setSize] = useState("small");

  //All the details properties for the 3D models, small of big iPhone
  const [model, setModel] = useState({
    title:'iPhone 15 Pro in Natural Titanium',
    color: ['#8F8A81','#FFE7B9', '#6F6C64'],
    img: yellowImg,
  })

  //Camera control for the two 3D models view
  const cameraControlSmall=useRef();
  const cameraControlLarge= useRef();


  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look
        </h1>

        {/* Container for the iphone 3D Model / h-[75vh]= 3/4 de l'écran /overflow-hidden: pour qu'il n'y ait aps de scrollbar*/}
        <div className="flex flex-col items-center mt-5">
          <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative ">
            <TheModel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Imodel;
