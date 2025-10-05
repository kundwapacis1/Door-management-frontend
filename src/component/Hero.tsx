
import React from 'react';

// Define the structure for the feature list items
interface Feature {
  id: number;
  name: string;
}

const features: Feature[] = [
  { id: 1, name: "RFID" },
  { id: 2, name: "PIN" },
  { id: 3, name: "Fingerprint Ready" },
  { id: 4, name: "Real-time Monitoring" },
];

// The main HeroSection component
export const HeroSection: React.FC = () => {
  // Define the dark blue background color seen in the image
  const sectionBgColor = "bg-[#154576]"; 
  // Define the amber/orange button color
  const buttonColor = "bg-amber-500"; 
  
  // Handles the CTA click (placeholder functionality)
  const handleGetStarted = () => {
    console.log("Get Started button clicked!");
    // In a real app, this would typically navigate the user or open a modal.
  };

  return (
    // Outer container for the Hero section with the dark blue background
    <section className={`min-h-[50vh] flex items-center justify-center ${sectionBgColor} font-sans`}>
      
      <div className="container mx-auto px-4 py-24 lg:py-40 text-center text-white">
        
        {/* Main Title */}
        <h1 className="
          text-3xl sm:text-5xl lg:text-6xl xl:text-4xl 
          font-extrabold 
          mb-8 lg:mb-10 
          max-w-4xl mx-auto
          leading-tight 
          rounded-lg
        ">
          Secure, Smart, and Scalable Door Management
        </h1>

        {/* Features/Subtitle List */}
        <p className="text-sm sm:text-lg lg:text-xl font-medium text-opacity-80 mb-10 lg:mb-12">
          {features.map((feature, index) => (
            <React.Fragment key={feature.id}>
              {feature.name}
              {/* Add a separator dot for all items except the last one */}
              {index < features.length - 1 && (
                <span className="mx-3 text-amber-500 cursor-pointer">•</span>
              )}
            </React.Fragment>
          ))}
        </p>

        {/* Call to Action Button */}
        <button
          onClick={handleGetStarted}
          className={`
            ${buttonColor}
            text-white 
            font-semibold 
            py-3 px-8 sm:py-4 sm:px-10 
            rounded-xl lg:rounded-2xl 
            shadow-lg 
            hover:shadow-2xl 
            transform transition duration-300 ease-in-out 
            hover:scale-[1.03] 
            focus:outline-none focus:ring-4 focus:ring-amber-300
            inline-flex items-center justify-center space-x-2 cursor-pointer
          `}
        >
          <span>Get Started</span>
          {/* Right arrow icon using a simple ASCII character for portability */}
          <span className="text-xl">→</span>
        </button>

      </div>
    </section>
  );
};


