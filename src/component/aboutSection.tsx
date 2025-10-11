import React from 'react';

// Define the structure for the key features
interface KeyFeature {
    id: number;
    title: string;
    description: string;
    icon: string; // Using icons (as inline SVGs or custom characters)
}

// Data for the improved About Section's Key Features
const keyFeatures: KeyFeature[] = [
    { 
        id: 1, 
        title: "PIN Authentication", 
        description: "Secure login with personal PIN codes for all personnel, fully compliant with organizational policies.", 
        icon: "🔑" 
    },
    { 
        id: 2, 
        title: "Multi-Factor Ready", 
        description: "Seamlessly integrate RFID cards, fingerprint scanners, and PINs for robust access control.", 
        icon: "🛡️" 
    },
    { 
        id: 3, 
        title: "Real-time Auditing", 
        description: "Maintain an immediate, immutable log of every entry and exit for enhanced security and accountability.", 
        icon: "⏱️" 
    },
    { 
        id: 4, 
        title: "Scalable Management", 
        description: "Effortlessly manage access for hundreds of doors and thousands of users from a single unified dashboard.", 
        icon: "🌐" 
    },
];


// Component for the improved About Section
const AboutSection: React.FC = () => {
    // Define the dark blue color used for the heading, consistent with the hero
    const primaryColor = "text-[#154576]"; 
    // Define the amber/orange accent color
    const accentColor = "text-amber-500";

    return (
        <section className="bg-white py-16 sm:py-24 font-sans">
            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Main Heading */}
                <h2 className={`text-3xl sm:text-4xl font-extrabold ${primaryColor} text-center mb-12`}>
                    Why Choose Smart Door Manager?
                </h2>

                {/* Content Grid: 2 columns on large screens, stacked on mobile */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                    
                    {/* Left Column: Mission/Value Proposition */}
                    <div className="lg:pr-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Elevating Security, Simplifying Access
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            The Smart Door Manager is a secure and scalable system designed to centralize and control access across your entire facility using modern, reliable authentication methods. It moves beyond traditional keys, providing administrators and users with powerful, real-time monitoring and streamlined management.
                        </p>
                        
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            The Challenge of Legacy Systems
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Traditional locks and physical keys are inherently inefficient and pose significant security risks for modern organizations. Our system eliminates these hassles, ensuring that only authorized personnel can access specific zones while automatically creating a tamper-proof log of every event.
                        </p>
                    </div>

                    {/* Right Column: Key Features Grid */}
                    <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            Core Capabilities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {keyFeatures.map((feature) => (
                                <div key={feature.id} className="p-5 bg-white rounded-xl shadow-md border border-gray-100 transition duration-200 hover:shadow-lg hover:border-amber-300">
                                    <div className={`text-3xl mb-3 ${accentColor}`}>{feature.icon}</div>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h4>
                                    <p className="text-sm text-gray-500">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};


export default AboutSection;


