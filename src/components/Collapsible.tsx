import { useState } from "react";
import Image from "next/image";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export default function Collapsible({ title, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <button
        onClick={toggle}
        className="w-full text-left px-4 py-4 bg-white-200 hover:bg-gray-300 focus:outline-none flex justify-between items-center"
      >
        <span>{title}</span>
        {isOpen ? (
            <Image src="/up-arrow.svg" alt="" width={20} height={20} />
        ) : 
        (
         <Image src="/down-arrow.svg" alt=""width={20} height={20}/>   
        )}
      </button>
      <hr/>
      {isOpen && <div className="p-4 bg-white">
        {children}
      </div>}
    </div>
  );
}