import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Imodel from "./components/Imodel";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highlights />
      <Imodel />
    </main>
  );
};

export default App;
