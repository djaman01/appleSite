import { navLists } from "../constants";
import { appleImg, bagImg, searchImg } from "../utils";

const Navbar = () => {
  return (
    //w-full = to take the full width of the screen
    <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center ">
      <nav className="flex w-full screen-max-width">
        {" "}
        {/* screen-max-width= à voir dans index.css */}
        <img src={appleImg} alt="Apple logo" width={14} height={18} />
        <div className="flex flex-1 justify-center max-sm:hidden">
          {/*max-sm= width of 600px and less */}  {/* transition-all= permet de passer du gris au blanc avec un petit délai lors du hover */}
          {navLists.map((e) => (
            <div
              key={e}
              className="px-5 text-sm cursor-pointer text-gray hover:text-white transition-all "
            >
      
              {e}
            </div>
          ))}
        </div>
        {/* flex-1: allow the flex-items to equally distribute the available space along the main axis of the flex container. */}
        <div className="flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1">  {/*items-baseline: aligne le bas des icones par rapport au cross-axis du flex container  */}
          <img src={searchImg} alt="search" width={18} height={18} />
          <img src={bagImg} alt="bag" width={18} height={18} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
