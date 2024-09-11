import { React, useRef, useState } from 'react';
import './App.css';

function App() {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);  // Optional loading state

  const handleFileUpload = async () => {
    const files = fileInputRef.current.files;
    if (files.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      try {
        setIsLoading(true);  // Start loading
        const response = await fetch("http://localhost:5000/upload", {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        console.log("uploaded files: ", data.files);

        // Show a success alert
        alert('Files uploaded successfully!');

        // Reset the file input
        fileInputRef.current.value = "";

      } catch (error) {
        console.log(error);
        alert('Error uploading files!');
      } finally {
        setIsLoading(false);  // End loading
      }
    } else {
      alert('Please select files to upload');
    }
  };

  return (
    <div className="App">
      <div className="container" style={{ backgroundColor: "#FA8072", padding: '40px', margin: "40px", borderRadius: '20px' }}>
        <h1>Upload Multiple Files to Google Drive</h1>
        <input type="file" multiple ref={fileInputRef} />
        <button onClick={handleFileUpload} disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>
    </div>
  );
}

export default App;
