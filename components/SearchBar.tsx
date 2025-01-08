"use client"
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import goBackendApi from "@/api/gobackend";

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Array<{ id: string; name: string }>>([]);
  const searchBarRef = useRef<HTMLInputElement | null>(null);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    searchSong(searchInput);
  }
  const searchSong = (query: string) => {};

  useEffect(() => {

    if (searchBarRef.current) {
      const callback = () => {
        setIsSearchBarFocused(true);
      };
      searchBarRef.current.addEventListener("focus",callback);
    }

    document.addEventListener<"click">("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.classList.contains("song-sugg") ||
        target.classList.contains("inputBar")
      ) {
        return;
      } else {
        setIsSearchBarFocused(false);
      }
    });
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      if (searchInput && isSearchBarFocused) {
        const res = await goBackendApi(`searchsong?query=${searchInput}`);
        const data = res.data.tracks as Array<{ id: string; name: string }>;
     
        setSuggestions(data);
        console.log(data);
        setLoading(false);
      } else {
        setSuggestions([]);
      }
    };
    const timeout = setTimeout(() => {
      fetchSearch();
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput, isSearchBarFocused]);

  return (
    <form
      className="sticky ml-10 top-0 z-10 p-2 sm:p-4 shadow-md bg-background w-[90vw]"
      onSubmit={handleSubmit}
    >
      <div className="max-w-3xl mx-auto flex justify-center items-center gap-2 sm:gap-3">
        <div className="relative">
          <Input
            placeholder="Search for music..."
            className="text-sm sm:text-base md:text-lg p-4 flex-grow rounded-full lg:w-[36rem] inputBar"
            required
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            ref={searchBarRef}
            type="text"
          />
          {searchInput && isSearchBarFocused ? (
            loading == true ? (
              <div className="bg-popover p-2 rounded-lg float_debouncer flex justify-center lg:w-[36rem] mt-2  shadow-lg w-full">
                <div className="w-10 h-10 border-4 border-t-foreground  rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="bg-popover p-2 rounded-lg float_debouncer lg:w-[36rem] mt-2 w-full shadow-lg">
                {suggestions.length > 0 ? (
                  <ul className=" flex flex-col gap-2 pt-2">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        className="p-2 hover:bg-foreground/20 rounded-md cursor-pointer  song-sugg"
                        onClick={() => searchSong(suggestion.name)}
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No suggestions found</p>
                )}
              </div>
            )
          ) : null}
        </div>
        <button
          type="submit"
          className="p-1 sm:p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors "
        >
          <Search className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </form>
  );
}
