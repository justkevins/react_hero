import React, { useState } from 'react';

interface ExplorerItemProps {
  name: string;
  children: Array<{ name: string; children: never[] }>;
  onItemSelected: (name: string) => void; // Update to match the type used in GLTFLoaderComponent
}

const ExplorerItem: React.FC<ExplorerItemProps> = ({ name, children, onItemSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    onItemSelected(name);
  };

  return (
    <div>
      <div onClick={() => setIsOpen(!isOpen)} onMouseDown={handleClick} className={`explorer-item`}>
        {children.length > 0 && <span className="toggle-icon">{isOpen ? '▼' : '►'}</span>}
        <span className="item-name">{name}</span>
      </div>
      {isOpen && (
        <div style={{ paddingLeft: '20px' }}>
          {children.map((child) => (
            <ExplorerItem key={child.name} name={child.name} children={child.children} onItemSelected={onItemSelected} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorerItem;
