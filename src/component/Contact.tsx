import React, { useState } from 'react';
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineCall } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import type{ReactNode} from 'react'

// Define the type for the contact form state
interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

// Define the type for contact details data
interface ContactDetail {
    icon:string | ReactNode;
    label: string;
    value: string;
}

// Contact information data
const contactDetails: ContactDetail[] = [
    { 
        icon: <HiOutlineMail/>, 
        label: "Email Support", 
        value: "support@smartdoormanager.com" 
    },
    { 
        icon: <MdOutlineCall/>, 
        label: "Phone", 
        value: "+250 788 123 456" 
    },
    { 
        icon: <IoLocationOutline/>, 
        label: "Office Address", 
        value: "Kigali, Rwanda - KG 123 St" 
    },
];

// The main ContactSection component
const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormState>({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact Form Submitted:", formData);
    // In a real application, you would send this data to an API endpoint here.
    alert("Thank you for your message! We will be in touch soon.");
    // Reset form (optional)
    setFormData({ name: '', email: '', message: '' });
  };

  // Define colors consistent with your previous sections
  const primaryColor = "text-[#154576]"; 
  const accentBgColor = "bg-amber-500";
  const accentHoverColor = "hover:bg-amber-600";

  return (
    <section className="bg-gray-50 py-16 sm:py-24 font-sans">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Main Heading */}
        <h2 className={`text-4xl sm:text-5xl font-extrabold ${primaryColor} text-center mb-16`}>
            Contact Our Team
        </h2>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Left Column: Contact Information Cards */}
            <div className="space-y-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                    Connect with Us Directly
                </h3>
                <p className="text-lg text-gray-600 mb-10">
                    We're ready to help you secure your facility. Reach out to our dedicated support team via phone, email, or visit our headquarters.
                </p>

                {contactDetails.map((detail, index) => (
                    <div key={index} className="flex items-start space-x-4 p-5 rounded-xl bg-white shadow-lg transition duration-300 hover:shadow-xl hover:border-l-4 hover:border-amber-500">
                        <div className={`text-3xl mt-1 ${primaryColor}`}>{detail.icon}</div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{detail.label}</p>
                            <a 
                                href={detail.label === 'Email Support' ? `mailto:${detail.value}` : detail.label === 'Phone' ? `tel:${detail.value.replace(/\s/g, '')}` : '#'}
                                className={`text-xl font-bold ${primaryColor} hover:text-amber-500 transition duration-150`}
                            >
                                {detail.value}
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Column: Contact Form */}
            <div className="p-6 sm:p-8 bg-white rounded-2xl shadow-2xl">
                <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left">
                    Send Us a Quick Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your Name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150"
                        />
                    </div>
                    
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@company.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150"
                        />
                    </div>

                    {/* Message Textarea */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Inquiry</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Tell us about your door management needs..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150 resize-none"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full ${accentBgColor} text-white font-semibold py-3 rounded-xl shadow-md transition duration-200 ${accentHoverColor} focus:outline-none focus:ring-4 focus:ring-amber-300`}
                    >
                        Send Message
                    </button>
                </form>
            </div>
            
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
