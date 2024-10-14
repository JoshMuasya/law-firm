import React from 'react';
import Lottie from 'lottie-react';
import animationData from '@/animations/Loading.json';

const LoadingAnimation = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="w-64 h-64"> {/* Adjust size as needed */}
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
};

export default LoadingAnimation;