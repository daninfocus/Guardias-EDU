import React from "react";

interface NavToggleButtonProps {
  setIsNavOpen: any;
  isNavOpen: any;
}

const NavToggleButton: React.FC<NavToggleButtonProps> = ({
  setIsNavOpen,
  isNavOpen,
}) => {
    
  return (
    <div className="flex flex-row justify-start z-40">
      <button
        onClick={() => setIsNavOpen(!isNavOpen)}
        className="navbar-burger flex items-center  p-3"
      >
        <div
          className={`flex flex-col z-40 transform transition-all duration-300 ${
            isNavOpen ? "translate-x-80" : ""
          }`}
        >
          <span
            className={`bg-gray-700 w-5 h-1 mt-[3px] shadow-none box-s text-black rounded-sm transform transition-all duration-300 ${
              isNavOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`bg-gray-700 w-5 h-1 mt-[3px] rounded-sm transform transition-all duration-300 ${
              isNavOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`bg-gray-700 w-5 h-1 mt-[3px] rounded-sm transform transition-all duration-300 ${
              isNavOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </div>
      </button>
    </div>
  );
};

export default NavToggleButton;
