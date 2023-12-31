import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";

function App() {
  const [compressedImages, setCompressedImages] = useState([]);

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    await handleImageFiles(files);
  };

  const handleImageDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    await handleImageFiles(files);
  };

  const handleImageFiles = async (files) => {
    const compressedImagesArray = [];

    for (let i = 0; i < files.length; i++) {
      const imageFile = files[i];
      try {
        const options = {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(imageFile, options);
        compressedImagesArray.push(compressedFile);
      } catch (error) {
        console.error("Error compressing image: ", error);
      }
    }

    // @ts-ignore
    setCompressedImages(compressedImagesArray);
  };

  const handleDownload = () => {
    const zip = new JSZip();

    compressedImages.forEach((image, index) => {
      zip.file(`image_${index + 1}.jpg`, image);
    });

    zip.generateAsync({ type: "blob" }).then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "compressed_images.zip";
      link.click();
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="card">
      <h1>NOJYK Application: Image Compression and ZIP</h1>
      <div
        className="drop-area"
        onDrop={handleImageDrop}
        onDragOver={handleDragOver}
        // @ts-ignore
        onClick={() => document.getElementById("fileInput").click()}
      >
        {/* traduire en francais */}
        <p>
          Faites glisser et déposez les images ici ou cliquez pour sélectionner
        </p>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </div>

      {compressedImages.length > 0 && (
        <button onClick={handleDownload}>
          Télécharger les images compressées
        </button>
      )}
    </div>
  );
}

export default App;
