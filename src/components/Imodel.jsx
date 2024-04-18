import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useState } from "react";
import iphoneNatural from "/assets/images/iphone-natural-none.png"

import { models } from "../constants";


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

  // To choose if we want to look at the small or big iphone 3D Model
  // const [size, setSize] = useState("small");

  //All the details properties for the 3D models, small of big iPhone
  const [model, setModel] = useState({
    title: "iPhone 15 Pro in Natural Titanium",
    color: ["#8F8A81", "#FFE7B9", "#6F6C64"],
    img: iphoneNatural,
  });

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look
        </h1>

        {/* h-[75vh]= 3/4 de l'écran /overflow-hidden: pour qu'il n'y ait pas de scrollbar*/}
        <div className="flex flex-col items-center mt-5">
          <div className="flex justify-center items-center w-full max-sm:h-[45vh] sm:h-[60vh]">
           <img src={model.img} alt="image" />
          </div>
          <div className="mx-auto w-full">
            <p className="text-sm font-light text-center mb-5">{model.title}</p>
            <div className="flex-center">
              {/* To map over all the colors that we can choose for the models / ul va etre le container gris des petits points avec les couleurs qui vont etre les <li>*/}
              <ul className="color-container">
                {models.map((e, i)=>(
                  <li key={i} className="w-6 h-6 rounded-full mx-2 cursor-pointer" style={{backgroundColor: e.color[0]}} onClick={()=>setModel(e)}>
                  </li>
                ))}
              </ul>

              {/* <button className="size-btn-container">
                {sizes.map(({label, value}) => ( //!!!!! on destructure les properties label et values pour pouvoir les utiliser dans .map / OnClick est ce qui permet de changer la value de la state: size et donc de changer les properties (backgroundColor et color) des boutons séléctionnés. state aura même valeu que bouton selectioné
                  <span key={label} className="size-btn" style={{backgroundColor: size===value ?'white':'transparent', color: size===value ? 'black' : 'white'}} onClick={()=>setSize(value)} >
                    {label}
                  </span>
                ) )}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Imodel;
