import {
  MeshReflectorMaterial,
  PresentationControls,
  Stage,
} from "@react-three/drei";
import { Mesh } from "three";
import Model from "./Model";
import React, { memo } from 'react';

interface ExperienceProps {
  color: string;
  selectedNode: string | null;
  onNodeSelect: (node: Mesh) => void;
  modelUrl: string | null;
  resetColor?: boolean;
}

const Experience: React.FC<ExperienceProps> = memo (({ color, selectedNode, onNodeSelect, modelUrl, resetColor }) => {
  return (
  <>
    <PresentationControls speed={1.5} global zoom={1} polar={[0, Math.PI / 2]}>
      <Stage environment={"city"} intensity={1} castShadow={false}>
        <Model
            onMeshesLoaded={(meshes) => console.log("Loaded Meshes:", meshes)}
            color={color}
            selectedPart={selectedNode} // Pass the selected part to the model
            onNodeSelect={onNodeSelect} // Handle node selection in 3D
            savedColors={new Map<string, string>()} 
            resetColor={resetColor} 
            modelUrl={modelUrl}            
            //selectedObject={selectedNode}
        />
      </Stage>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, -0.625, 0]}>
        <planeGeometry args={[170, 170]} />
        <MeshReflectorMaterial
          blur={[1700, 500]}
          resolution={720}
          mixBlur={0.8}
          mixStrength={60}
          roughness={3}
          depthScale={1.5}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#101010"
          metalness={0.3}
          mirror={2}
        />
      </mesh>
    </PresentationControls>
  </>
  );
});

export default Experience;