import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Home, Menu, X, Settings, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const navigate= useNavigate()
  const menuItems = [
    { icon: Home, label: 'Home' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help' },
  ];

  return (
    <>
      <Button 
        onClick={toggleSidebar}
        className="fixed top-2 left-2 z-50 p-2 bg-background"
        variant="outline"
        size="icon">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      <div 
        className={`fixed top-0 left-0 h-full w-64 z-30  shadow-lg transform transition-transform bg-background duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col h-full pt-16">
          <ul className="flex-grow space-y-2 p-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-lg py-6"
                >
                  <item.icon size={32} className="mr-4" />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
          <div className="p-4 border-t">
            <p className="text-sm ">© 2024 Anmol Singh</p>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;