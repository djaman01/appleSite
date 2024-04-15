import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TheModel from "./TheModel";
import { useRef, useState } from "react";
import { yellowImg } from "../utils";

//HERE WE'LL USE THREE.JS LIBRARY FOR REACT, to create and display 3D graphics in a web browser
import * as THREE from "three"; //==import everything from the Three.js library, and make everything accessible through the 'THREE' Variable
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { models, sizes } from "../constants";

gsap.registerPlugin(ScrollTrigger);

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
    title: "iPhone 15 Pro in Natural Titanium",
    color: ["#8F8A81", "#FFE7B9", "#6F6C64"],
    img: yellowImg,
  });

  //Camera control for the two 3D models view
  const cameraControlSmall = useRef();
  const cameraControlLarge = useRef();

  //The models: Ref to keep track of the 3D model and access it's properties when animating
  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  //To keep track of the rotation value of each models
  const [smallRotation, setSmallRotation] = useState(0);
  const [largeRotation, setLargeRotation] = useState(0);

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look
        </h1>

        {/* Container for the 2 iphones 3D Models, small and large / h-[75vh]= 3/4 de l'écran /overflow-hidden: pour qu'il n'y ait pas de scrollbar*/}
        <div className="flex flex-col items-center mt-5">
          <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative ">
            <TheModel
              index={1}
              groupeRef={small}
              gsapType="view1"
              controlRef={cameraControlSmall}
              setRotationState={setSmallRotation}
              item={model} //can be the small or large model depending on which we'll choose
              size={size}
            />
            <TheModel
              index={2}
              groupeRef={large}
              gsapType="view2"
              controlRef={cameraControlLarge}
              setRotationState={setLargeRotation}
              item={model} //can be the small or large model depending on which we'll choose
              size={size}
            />
            {/* Canvas Components coming from React Three Fiber*/}
            {/*View.Port= It's a way to render multiple views of a Model in the same Canvas => So it enables us to animate the model */}
            <Canvas
              className="w-full h-full" //canvas is full screen
              style={{
                //reset the positioning
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: "hidden",
              }}
              eventSource={document.getElementById("root")} //To interact with the model that we work with
            >
              <View.Port />
            </Canvas>
          </div>
          <div className="mx-auto w-full">
            <p className="text-sm font-light text-center mb-5">{model.title}</p>
            <div className="flex-center">
              {/* To map over all the colors that we can choose for the models / ul va etre le container gris avec coté arrondis des petits points avec les couleurs qui vont etre les <li>*/}
              <ul className="color-container">
                {models.map((e, i)=>( //onClick va servir à ce que le model 3D de l'iphone prenne la couleur selctionnée dans le <li> et que le titre (model.title) change
                  <li key={i} className="w-6 h-6 rounded-full mx-2 cursor-pointer" style={{backgroundColor: e.color[0]}} onClick={()=>setModel(e)}> 
                  </li>
                ))}
              </ul>

              <button className="size-btn-container">
                {sizes.map(({label, value}) => ( //!!!!! on destructure les properties label et values pour pouvoir les utiliser dans .map / OnClick est ce qui permet de changer la value de la state: size et donc de changer les properties (backgroundColor et color) des boutons séléctionnés. state aura même valeu que bouton selectioné
                  <span key={label} className="size-btn" style={{backgroundColor: size===value ?'white':'transparent', color: size===value ? 'black' : 'white'}} onClick={()=>setSize(value)} >
                    {label}
                  </span>
                ) )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Imodel;
