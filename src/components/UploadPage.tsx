import React from 'react';

interface UploadPageProps {
  onFileUpload: (url: string) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onFileUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      console.log('Uploaded File URL:', fileUrl); // Log the uploaded file URL
      console.log(file); // Log the uploaded file's details
      onFileUpload(fileUrl); // Send the file URL to App
      return () => URL.revokeObjectURL(fileUrl);
    }
  };

  const triggerFileUpload = () => {
    const fileInput = document.getElementById('upload-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <h1>3D Configurator</h1>
      <input
        type="file"
        accept=".glb"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="upload-file"
      />
      <button
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
        onClick={triggerFileUpload}
      >
        Upload .glb File
      </button>
    </div>
  );
};

export default UploadPage;


