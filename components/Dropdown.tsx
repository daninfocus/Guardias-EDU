import { Menu, Transition } from "@headlessui/react";
import { Fragment, SVGProps, useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";

const Dropdown = (props:{deleteSelectedGuardia:Function}) => {
  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            Options
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2  origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                <button className="hover:bg-emerald-400 hover:text-white text-gray-900  group flex w-full items-center rounded-md px-2 py-2 text-sm">
                  <EditIcon
                    color="#47bf67"
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Edit
                </button>
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                <button  onClick={()=>props.deleteSelectedGuardia()} className="hover:bg-red-300 hover:text-white text-gray-900  group flex w-full items-center rounded-md px-2 py-2 text-sm">
                  <DeleteIcon
                    color="#c23a5a"
                    className="mr-2 h-5 w-5 "
                    aria-hidden="true"
                  />
                  Delete
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

function EditIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        stroke={props.color}
        strokeWidth="2"
      />
    </svg>
  );
}

function DeleteIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        stroke={props.color}
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke={props.color} strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke={props.color} strokeWidth="2" />
    </svg>
  );
}

export default Dropdown;
