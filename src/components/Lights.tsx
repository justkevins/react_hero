import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useControls } from "leva";

interface CustomLight {
  id: string;
  on: boolean;
  intensity: number;
  color: string;
  position: [number, number, number];
}

interface LightProps {
  lights: CustomLight[];
  setLights: React.Dispatch<React.SetStateAction<CustomLight[]>>;
}

const Lights: React.FC<LightProps> = ({ lights, setLights }) => {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const directionalRefs = useRef<Array<THREE.DirectionalLight | null>>([null, null, null]);
  const pointRef = useRef<THREE.PointLight>(null);

  const levaControls = lights.map((light) => {
    return useControls(
      `${light.id} Light`, {
        on: {
          value: light.on,
          label: "On/Off",
          onChange: (v) => {
            setLights((prev) =>
              prev.map((l) => (l.id === light.id ? { ...l, on: v } : l))
            );
          },
        },
        intensity: {
          value: light.intensity,
          min: 0,
          max: 10,
          step: 0.1,
          onChange: (v) => {
            setLights((prev) =>
              prev.map((l) => (l.id === light.id ? { ...l, intensity: v } : l))
            );
          },
        },
        color: {
          value: light.color,
          onChange: (v) => {
            setLights((prev) =>
              prev.map((l) => (l.id === light.id ? { ...l, color: v } : l))
            );
          },
        },
        position: {
          value: light.position,
          min: -10,
          max: 10,
          step: 0.1,
          onChange: (v) => {
            setLights((prev) =>
              prev.map((l) => (l.id === light.id ? { ...l, position: v } : l))
            );
          },
        },
      }
    );
  });

  useEffect(() => {
    lights.forEach((light) => {
      switch (light.id) {
        case "ambient":
          if (ambientRef.current) {
            ambientRef.current.visible = light.on;
            ambientRef.current.intensity = light.intensity;
            ambientRef.current.color = new THREE.Color(light.color);
          }
          break;
        case "directional1":
        case "directional2":
        case "directional3":
          const index = parseInt(light.id.replace("directional", "")) - 1;
          if (directionalRefs.current[index]) {
            directionalRefs.current[index]!.visible = light.on;
            directionalRefs.current[index]!.intensity = light.intensity;
            directionalRefs.current[index]!.color = new THREE.Color(light.color);
            directionalRefs.current[index]!.position.set(...light.position);
          }
          break;
        case "point":
          if (pointRef.current) {
            pointRef.current.visible = light.on;
            pointRef.current.intensity = light.intensity;
            pointRef.current.color = new THREE.Color(light.color);
            pointRef.current.position.set(...light.position);
          }
          break;
        default:
          break;
      }
    });
  }, [lights]);

  return (
    <>
      <ambientLight ref={ambientRef} />
      {[1, 2, 3].map((idx) => (
        <directionalLight
          key={idx}
          ref={(el) => (directionalRefs.current[idx - 1] = el)}
        />
      ))}
      <pointLight ref={pointRef} />
    </>
  );
};

export default Lights;
