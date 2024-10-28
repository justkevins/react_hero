import React from 'react';
import ExplorerItem from './ExplorerItem';
import './Explorer.css';

interface ExplorerProps {
  onItemSelected: (name: string) => void;
  hierarchy: string[]; // Now it will receive an array of mesh names
}

const Explorer: React.FC<ExplorerProps> = ({ onItemSelected, hierarchy }) => {
  return (
    <div className="explorer-container">
      <h3>Model Hierarchy</h3>
      {hierarchy.map((name) => (
        <ExplorerItem
          key={name}
          name={name}
          onItemSelected={onItemSelected}
          children={[]} // No children since these are individual meshes
        />
      ))}
    </div>
  );
};

export default Explorer;
