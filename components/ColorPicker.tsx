import React, { useState } from "react";

const ColorPicker = (props: {
  setSelectedColor: Function;
  selectedColor: number;
  colors: Array<String>;
  childClick: Function;
  isOpen: boolean;
}) => {
  return (
    <div className="flex items-center">
      <div className="relative ">
        <button
          type="button"
          onClick={(e) => props.childClick(e)}
          className={
            props.selectedColor != undefined
              ? "text-white w-10 h-10 rounded-full focus:outline-none focus:shadow-outline inline-flex p-2 shadow"
              : "text-slate-500  w-10 h-10 rounded-full focus:outline-none focus:shadow-outline inline-flex p-2 shadow"
          }
          style={{ background: props.colors[props.selectedColor].toString() }}
        >
          <svg
            className="w-6 h-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              d="M15.584 10.001L13.998 8.417 5.903 16.512 5.374 18.626 7.488 18.097z"
            />
            <path d="M4.03,15.758l-1,4c-0.086,0.341,0.015,0.701,0.263,0.949C3.482,20.896,3.738,21,4,21c0.081,0,0.162-0.01,0.242-0.03l4-1 c0.176-0.044,0.337-0.135,0.465-0.263l8.292-8.292l1.294,1.292l1.414-1.414l-1.294-1.292L21,7.414 c0.378-0.378,0.586-0.88,0.586-1.414S21.378,4.964,21,4.586L19.414,3c-0.756-0.756-2.072-0.756-2.828,0l-2.589,2.589l-1.298-1.296 l-1.414,1.414l1.298,1.296l-8.29,8.29C4.165,15.421,4.074,15.582,4.03,15.758z M5.903,16.512l8.095-8.095l1.586,1.584 l-8.096,8.096l-2.114,0.529L5.903,16.512z" />
          </svg>
        </button>

        {props.isOpen ? (
          <div className="z-50 ease-in duration-100 origin-top-left absolute right-50 mt-2 w-40 rounded-md shadow-lg">
            <div className="rounded-md bg-white shadow-xs px-4 py-3">
              <div className="flex flex-wrap -mx-2">
                {props.colors.map((element, index) => {
                  return (
                    <div className="px-2" key={index}>
                      {props.selectedColor === index ? (
                        <div
                          className="w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white"
                          style={{
                            background: element.toString(),
                            boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.2)",
                          }}
                        ></div>
                      ) : (
                        <div
                          onClick={() => props.setSelectedColor(index)}
                          className="w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white focus:outline-none focus:shadow-outline"
                          style={{ background: element.toString() }}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
