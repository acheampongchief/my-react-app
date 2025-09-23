import React, { useState } from 'react';

function CameraCapture() {
  const [image, setImage] = useState(null);

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
    <div>
      <input className='rounded-lg bg-blue-500 px-5 py-5 text-white'
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
      />
      {image && (
        <div>
          <h3>Preview:</h3>
          <img src={image} alt="Captured" style={{ width: '300px' }} />
        </div>
      )}
    </div>

    <div>
      <button className='bg-blue-600 py-5 px-5 rounded-lg text-white'>Take Photo</button>
    </div>
    </>
  );
}

export default CameraCapture;