import { Canvas } from "@react-three/fiber";
import "./App.css";
import Experience from "./components/Experience";
import Lights from "./components/Lights";
import { useState } from "react";

interface Light {
  id: string;
  on: boolean;
  intensity: number;
  color: string;
  position: [number, number, number];
}

function App() {
  const defaultColor = "#101010";
  const [lights, setLights] = useState<Light[]>([
    { id: "ambient", on: false, intensity: 0.5, color: "#ffffff", position: [0, 0, 0] },
    { id: "directional1", on: false, intensity: 5, color: "#ffffff", position: [1, 1, 1] },
    { id: "directional2", on: false, intensity: 1, color: "#ffffff", position: [-1, 1, 1] },
    { id: "directional3", on: false, intensity: 4, color: "#ffffff", position: [0, -1, 1] },
    { id: "point", on: false, intensity: 5, color: "#ffffff", position: [1, 1, 1] },
  ]);

  const exportToJson = () => {
    const json = JSON.stringify(lights, null, 2); 
    console.log(json);
    // Optionally save to file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lights-config.json';
    link.click();
  };

  return (
    <div className="canvas-container">
      <button onClick={exportToJson}>Export Lights Configuration</button>

      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <color attach="background" args={[defaultColor]} />
        <fog attach="fog" args={[defaultColor, 20, 20]} />
        <Experience onMeshesLoaded={() => {}} />
        <Lights lights={lights} setLights={setLights} />
      </Canvas>
    </div>
  );
}

export default App;
