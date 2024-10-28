import { useControls } from "leva";
import {
  MeshReflectorMaterial,
  PresentationControls,
  Stage,
} from "@react-three/drei";
import Model from "./Model";

interface ExperienceProps {
  onMeshesLoaded: (meshes: string[]) => void;
}

const Experience: React.FC<ExperienceProps> = ({ onMeshesLoaded }) => {

  const { stageLightingEnabled, stageLightingIntensity } = useControls({
    stageLightingEnabled: { value: true, label: "Enable Stage Lighting" },
    stageLightingIntensity: {
      value: 0.5,
      min: 0,
      max: 10,
      step: 0.01,
      label: "Stage Lighting Intensity",
    },
  });

  return (
    <>
      <PresentationControls
        speed={1.5}
        global
        zoom={1}
        polar={[0, Math.PI / 2]}
      >
        <Stage
          environment={stageLightingEnabled ? "city" : null}
          intensity={stageLightingEnabled ? stageLightingIntensity : 0}
          castShadow={false}
        >
          <Model onMeshesLoaded={onMeshesLoaded} />
        </Stage>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, -0.625, 0]}>
        <planeGeometry args={[180, 180]}  />
          <MeshReflectorMaterial
            blur={[1900, 1700]}
            resolution={720}
            mixBlur={0.9}
            mixStrength={60}
            roughness={4}
            depthScale={1.5}
            minDepthThreshold={1}
            maxDepthThreshold={1.4}
            color="#101010"
            metalness={0.5}
            mirror={9}
          />
      </mesh>
      </PresentationControls>
    </>
  );
};

export default Experience;
