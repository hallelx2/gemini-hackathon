import React, { useState } from 'react';

const CustomDropdown = ({ onChange, }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('English');
    
    const options = [
        { value: 'en', label: 'English' },
        { value: 'de', label: 'German' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'ar', label: 'Arabic' }
    ];

    const handleOptionClick = (option) => {
        setSelectedOption(option.label);
        setIsOpen(false);
        onChange(option.value); // Call the callback function with the selected value
    };

    return (
        <div className="relative flex justify-center">
            <button
                className="flex items-center gap-2 py-2 px-4 bg-gray-200 text-gray-800 rounded focus:outline-none focus:bg-gray-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption || 'Select Language'}
                <svg
                    className={`w-4 h-4 fill-current ${isOpen ? 'transform rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 12l-8-8H1l9 9 9-9h-1l-8 8z" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute top-full w-40 left-1/2 -translate-x-1/2 mt-1 bg-white shadow-lg rounded">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            className="block w-full py-2 px-4 text-gray-800 hover:bg-gray-200 focus:outline-none"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
