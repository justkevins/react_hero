import { useGLTF } from "@react-three/drei";
interface ModelProps {
  onMeshesLoaded: (meshes: string[]) => void;
}

const Model: React.FC<ModelProps> = ({ }) => {
  const { scene } = useGLTF('/models/bike.glb');

  return(
    <>
        {scene && <primitive object={scene} />}
    </>
  );
};

export default Model;
