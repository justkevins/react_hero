
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';

interface ModelProps {
  onMeshesLoaded: (meshes: string[]) => void;
  color: string;
  selectedPart: string | null;
  onNodeSelect: (node: THREE.Mesh) => void;
  resetColor?: boolean;
  savedColors: Map<string, string>;
  deleteColors?: boolean;
  modelUrl: string | null; 
}

const Model: React.FC<ModelProps> = ({
  onMeshesLoaded,
  color,
  selectedPart,
  onNodeSelect,
  resetColor,
  //savedColors = new Map<string,string>(), // Default to an empty map if undefined
  deleteColors,
  modelUrl
}) => {
  if (!modelUrl) {
    return null; // Or a fallback UI
  }
  const { scene } = useGLTF(modelUrl);
  
console.log("Model URL:", modelUrl);
  const previousMeshNamesRef = useRef<string[]>([]);
  const originalColorsRef = useRef<Map<string, THREE.Color>>(new Map());
  const [hoveredMesh, setHoveredMesh] = useState<THREE.Mesh | null>(null);
  const [isColorPickerActive] = useState(false); // Track if the color picker is active

  useEffect(() => {
    if (!scene) return;

    const meshNames: string[] = [];

    // Traverse the scene to collect mesh names and store original colors
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        meshNames.push(object.name || 'Unnamed Mesh');

        // Store the original color if not already stored
        const material = object.material as THREE.MeshStandardMaterial;
        if (material && !originalColorsRef.current.has(object.name)) {
          originalColorsRef.current.set(object.name, material.color.clone());
        }

        // Apply saved color if it exists and savedColors is valid
        /*const savedColor = savedColors.get(object.name);
        if (savedColor) {
          material.color.set(savedColor);
        }*/
      }
    });

    // If the mesh names have changed, trigger callback
    if (
      meshNames.length !== previousMeshNamesRef.current.length ||
      !meshNames.every((name, index) => name === previousMeshNamesRef.current[index])
    ) {
      previousMeshNamesRef.current = meshNames;
      onMeshesLoaded(meshNames);
    }
  }, [scene, onMeshesLoaded /*, savedColors*/]);

  // Apply color when the selected part or color changes
  useEffect(() => {
    if (selectedPart && scene) {
      const mesh = scene.getObjectByName(selectedPart) as THREE.Mesh;
      if (mesh) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material) {
          material.color.set(color);
           // If color picker is not active, highlight the selected mesh
           if (!isColorPickerActive) {
            material.emissive.set('#ffcc00'); // Highlight the selected mesh (emissive glow)
            setTimeout(() => {
              material.emissive.set(0x000000); // Reset emissive highlight after delay
            }, 300);
          } else {
            material.emissive.set(0x000000); // Ensure no emissive color when changing color
          }
        }
      }
    }
  }, [selectedPart, color, scene, isColorPickerActive]);

// Reset color when reset is triggered
useEffect(() => {
  if (resetColor && selectedPart && scene) {
    const mesh = scene.getObjectByName(selectedPart) as THREE.Mesh;
    if (mesh) {
      const material = mesh.material as THREE.MeshStandardMaterial;
      const originalColor = originalColorsRef.current.get(mesh.name);
      
      if (material && originalColor) {
        console.log("Resetting color for:", selectedPart, "to", originalColor);
        material.color.set(originalColor); // Reset to original color
        material.needsUpdate = true; 
      }
    }
  }
}, [resetColor, selectedPart, scene]);




  useEffect(() => {
    if (hoveredMesh) {
      const material = hoveredMesh.material as THREE.MeshStandardMaterial;
      material.emissive.set('#00ccff'); // Set hover color (blue outline)
    }
    return () => {
      if (hoveredMesh) {
        const material = hoveredMesh.material as THREE.MeshStandardMaterial;
        material.emissive.set(0x000000); // Reset emissive color when unhovered
      }
    };
  }, [hoveredMesh]);

  // Delete colors (reset all to original)
  useEffect(() => {
    if (deleteColors && scene) {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const material = object.material as THREE.MeshStandardMaterial;
          const originalColor = originalColorsRef.current.get(object.name);
          if (material && originalColor) {
            material.color.set(originalColor);
          }
        }
      });
    }
  }, [deleteColors, scene]);

  const handleMeshClick = (event: any) => {
    const object = event.intersections[0].object as THREE.Mesh;
    onNodeSelect(object);
  };

  const handlePointerOver = (event: any) => {
    const mesh = event.intersections[0].object as THREE.Mesh;
    setHoveredMesh(mesh);
  };

  const handlePointerOut = () => {
    setHoveredMesh(null);
  };

  return (
    <>
      {scene && <primitive
        object={scene}
        onClick={handleMeshClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />}
    </>
  );
};

export default Model;
