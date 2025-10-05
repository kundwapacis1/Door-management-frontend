import React from 'react';
import { FaFacebookF } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa";

// Define the structure for a navigation link
interface FooterLink {
    name: string;
    href: string;
}

// Data for navigation columns
const productLinks: FooterLink[] = [
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Integrations', href: '#' },
    { name: 'Demo', href: '#' },
];

const companyLinks: FooterLink[] = [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Partners', href: '#' },
];

const resourceLinks: FooterLink[] = [
    { name: 'Help Center', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Security', href: '#' },
    { name: 'Privacy Policy', href: '#' },
];

// The main Footer component
const FooterSection: React.FC = () => {
    // Define the dark blue color consistent with the rest of the application
    const primaryBgColor = "bg-gray-500"; 
    const textColor = "text-gray-100";
    const hoverColor = "hover:text-amber-400"; // Using the amber accent color for hover

    return (
        <footer className={`font-sans ${primaryBgColor} pt-16`}>
            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Main Grid: Logo/Slogan + Navigation Links */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-10">
                    
                    {/* Column 1: Brand Info */}
                    <div className="col-span-2 md:col-span-2 pr-8">
                        <h3 className="text-3xl font-extrabold text-white mb-3">
                            SmartDoor Manager
                        </h3>
                        <p className={`text-lg mb-6 ${textColor}`}>
                            Secure, Smart, and Scalable Access Control.
                        </p>
                        
                        {/* Social Icons (using placeholders) */}
                        <div className="flex space-x-4">
                            <a href="#" aria-label="Facebook" className={`text-2xl ${textColor} ${hoverColor}`}>
                                <i className="fab fa-facebook-f"></i> {/* Placeholder for icon library */}
                                 <FaFacebookF/>
                            </a>
                            <a href="#" aria-label="Twitter" className={`text-2xl ${textColor} ${hoverColor}`}>
                                <i className="fab fa-twitter"></i> {/* Placeholder for icon library */}
                                <IoLogoTwitter/>
                            
                            </a>
                            <a href="#" aria-label="LinkedIn" className={`text-2xl ${textColor} ${hoverColor}`}>
                                <i className="fab fa-linkedin-in"></i> {/* Placeholder for icon library */}
                                <FaLinkedinIn/>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Product Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3">
                            {productLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className={`text-sm ${textColor} ${hoverColor} transition duration-150`}>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Company Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-3">
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className={`text-sm ${textColor} ${hoverColor} transition duration-150`}>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Resources Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {resourceLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className={`text-sm ${textColor} ${hoverColor} transition duration-150`}>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar: Copyright and Contact */}
                <div className="py-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <p className={`text-sm ${textColor}`}>
                        &copy; {new Date().getFullYear()} SmartDoor Manager. All rights reserved.
                    </p>
                    <a 
                        href="mailto:support@smartdoormanager.com" 
                        className={`text-sm ${textColor} ${hoverColor} mt-2 md:mt-0`}
                    >
                        support@smartdoormanager.com
                    </a>
                </div>
            </div>
            
            {/* Required dependency for font-awesome icons, if used */}
            <script src="https://kit.fontawesome.com/a076d05399.js" crossOrigin="anonymous"></script>
        </footer>
    );
};


export default FooterSection;
