import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';


interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color = '#fff', onChange }) => {
  const [currentColor, setCurrentColor] = useState(color);

  const handleChange = (newColor: string) => {
    setCurrentColor(newColor);
    onChange(newColor); // Pass the selected color to the parent component
  };

  return (
    <div className="color-picker">
      <HexColorPicker color={currentColor} onChange={handleChange} />
    </div>
  );
};

export default ColorPicker;