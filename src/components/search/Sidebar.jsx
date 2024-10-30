import React, { useState } from "react";
import { Button } from "../ui/button";
import { Home, Menu, X, List, User,Baby } from "lucide-react";
import { useEffect ,useRef} from "react";
import { useStore } from "../../zustand/store";
import { Dialog, DialogContent } from "../ui/dialog";
import AuthTab from "../../Auth/AuthTab";
import { signOut, getAuth } from "firebase/auth";
import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover";
import Playlist from "../playlist/Playlists";
import { app } from "../../Auth/firebase";
const Sidebar = () => {
  const sidebarRef = useRef(null);
  const auth = getAuth(app);
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const { isUser, setIsUser, dialogOpen, setDialogOpen } = useStore();
  const [popover,setPopover]=useState(false)
  function handlePlaylist() {
    if (isUser) {
      setPopover(true)
    } else {
      setDialogOpen(true);
      setIsOpen(false);
      setPopover(false)
    }
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Toggle Sidebar"]')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <AuthTab />
        </DialogContent>
      </Dialog>
      
      <Button
        onClick={toggleSidebar}
        className="fixed top-2 left-2 z-50 p-2 bg-background"
        variant="outline"
        size="icon"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-48 sm:w-64 z-30 shadow-lg transform transition-transform bg-background duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col h-full pt-16 shadow-2xl">
          <ul className="flex-grow space-y-2 p-4">
            <li>
              <Button
                onClick={() =>
                  navigate(`/search?searchTxt=${localStorage.getItem("search")}`)
                }
                variant="ghost"
                className="w-full justify-start text-lg py-6"
              >
                <Home size={32} className="mr-4" /> Home
              </Button>
            </li>
            <li>
              <Popover open={popover} onOpenChange={setPopover}>
                <PopoverTrigger className="w-full">
                  <Button
                    variant="ghost"
                    onClick={handlePlaylist}
                    className="w-full justify-start text-lg py-6"
                  >
                    <List size={32} className="mr-4" /> Playlist
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Playlist />
                </PopoverContent>
              </Popover>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-lg py-6"
              >
                <Baby size={32} className="mr-4" /> About me
              </Button>
            </li>
            {!isUser && (
              <li>
                <Button
                  onClick={() => {
                    setDialogOpen(true);
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start text-lg py-6"
                >
                  <User size={32} className="mr-4" /> LogIn
                </Button>
              </li>
            )}
            {isUser && (
              <li>
                <Button
                  onClick={() => {
                    signOut(auth);
                    setIsUser(false);
                  }}
                  variant="ghost"
                  className="w-full text-black bg-red-400 justify-start text-lg py-6"
                >
                  <User size={32} className="mr-4" /> Logout
                </Button>
              </li>
            )}
          </ul>
          <div className="p-4 border-t">
            <p className="text-sm">© 2024 Anmol Singh</p>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;