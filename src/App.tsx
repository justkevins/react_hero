import { Canvas } from "@react-three/fiber";
import { useState, useEffect, startTransition, Suspense } from "react";
import "./App.css";
import ColorPicker from "./components/ColorPicker";
import Experience from "./components/Experience";
import Explorer from "./components/Explorer";
import Model from "./components/Model";
import { Mesh } from "three";
import UploadPage from "./components/UploadPage";

function App() {
  const defaultColor = "#101014";
  const [modelColor, setModelColor] = useState(defaultColor);
  const [meshNames, setMeshNames] = useState<string[]>([]); // Store mesh names
  const [selectedPart, setSelectedPart] = useState<string | null>(null); // Track selected part
  const [resetColor, setResetColor] = useState(false); // Track reset color state
  const [savedColors, setSavedColors] = useState<Map<string, string>>(
    new Map()
  ); 
  const [deleteColors, setDeleteColors] = useState(false); // Track delete colors
  const [uploadedModelUrl, setUploadedModelUrl] = useState<string | null>(null); // State for the uploaded model URL

  useEffect(() => {
    const storedColors = localStorage.getItem("savedColors");
    if (storedColors) {
      setSavedColors(new Map(JSON.parse(storedColors)));
    }
  }, []);

  const handleMeshesLoaded = (meshes: string[]) => {
    setMeshNames(meshes);
  };

  const handleItemSelected = (name: string) => {
    setSelectedPart(name); // Set the selected part from Explorer
    console.log("Selected Mesh from Explorer:", name);
  };

  const handleNodeSelect = (mesh: Mesh) => {
    setSelectedPart(mesh.name); // Set the selected part from the 3D view
    console.log("Selected Mesh in 3D view:", mesh.name);
    setResetColor(false);
  };

  const handleResetColor = () => {
    if (selectedPart) {
      console.log("Resetting color for:", selectedPart); // Debugging line
      setResetColor(true); // Trigger the reset flag
    }
    setTimeout(() => {
      setResetColor(false); // Reset the flag after the operation
    }, 200);
  };

  const handleSaveColors = () => {
    localStorage.setItem(
      "savedColors",
      JSON.stringify(Array.from(savedColors.entries()))
    );
    alert("Colors saved!");
  };

  const handleDeleteColors = () => {
    setDeleteColors(true); // Trigger deleting all colors (back to default)
    setTimeout(() => setDeleteColors(false), 100); // Reset the deleteColors flag //here the setDeleteColors was false, if any thing issue make to flase
    setSavedColors(new Map()); // Clear saved colors
    localStorage.removeItem("savedColors"); // Remove saved colors from localStorage
    alert("All colors deleted!");
  };

  const handleColorChange = (color: string) => {
    setModelColor(color);
    if (selectedPart) {
      setSavedColors((prev) => new Map(prev.set(selectedPart, color))); // Save color to map
    }
  };

  const handleFileUploadSuccess = (uploadedFileUrl: string) => {
    startTransition(() => {
      setUploadedModelUrl(uploadedFileUrl);
    });
  };

  return (
    <div className="canvas-container">
      {!uploadedModelUrl ? (
        <UploadPage
          onFileUpload={handleFileUploadSuccess}
        />
      ) : (
        <>
          <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
            <color attach="background" args={[defaultColor]} />
            <fog attach="fog" args={[defaultColor, 20, 20]} />
            <Experience
              color={modelColor}
              selectedNode={selectedPart}
              onNodeSelect={handleNodeSelect}
              modelUrl={uploadedModelUrl}
            />
          </Canvas>
          <div className="controls">
            <ColorPicker color={modelColor} onChange={handleColorChange} />
          </div>
          <div className="controls1">
            <button onClick={handleResetColor}>Reset Color</button>{" "}
            <button onClick={handleSaveColors}>Save Colors</button>{" "}
            <button onClick={handleDeleteColors}>Delete Colors</button>{" "}
          </div>
          <Explorer onItemSelected={handleItemSelected} hierarchy={meshNames} />
          <Suspense
            fallback={
              <div className="loading-container">
                <div className="spinner"></div> 
                <div className="loading-text">Loading 3D model...</div>{" "}
              </div>
            }
          >
            <Model
              onMeshesLoaded={handleMeshesLoaded}
              color={modelColor}
              selectedPart={selectedPart}
              onNodeSelect={handleNodeSelect}
              resetColor={resetColor}
              savedColors={savedColors}
              deleteColors={deleteColors}
              modelUrl={uploadedModelUrl}
            />
          </Suspense>
        </>
      )}
    </div>
  );
}

export default App;
