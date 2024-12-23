import { useState } from "react";

function SelectField({
    name,
    id,
    value,
    onChange,
    viewName,
    className,
    options,
    selectname,
}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleOptionSelect = (optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    return (
        <div className={`relative w-full z-0 mb-5 group ${className}`}>
            {/* Label */}
            <label
                htmlFor={id}
                className="block text-sm text-gray-700 "
            >
                {viewName}
            </label>

            {/* Selected Value */}
            <div
                onClick={handleToggle}
                className="inputfieldborder text-sm flex justify-between items-center cursor-pointer px-4 py-3 pb-3.5"
            >
                <span>{value || selectname}</span>
                <svg
                    className={`transform transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </div>

            {/* Options Dropdown */}
            {isOpen && (
                <ul
                    className="absolute w-full bg-white border border-gray-300 rounded-md mt-2 z-10 transition-transform duration-700 transform scale-y-0 origin-top"
                    style={{ transform: "scaleY(1)" }}
                >
                    {options.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleOptionSelect(option.value)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SelectField;
