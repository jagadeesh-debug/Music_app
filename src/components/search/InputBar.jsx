import { useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export default function InputBar() {
  const inputRef = useRef();
  const [, setSearchQuery] = useSearchParams();
  const CurrPath = useLocation();
  const router = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem("search", inputRef.current.value);
    const search = inputRef.current.value;
    setSearchQuery({ search });
    localStorage.setItem("search", search);

    const path = {
      pathname: "/search",
      search: createSearchParams({
        searchtxt: search,
      }).toString(),
    };
    if (CurrPath.pathname !== "/search") router(path);
  }
  return (
    <form
      className="sticky ml-10 top-0 z-10 p-2 sm:p-4 shadow-md bg-background w-[90vw]"
      onSubmit={handleSubmit}
    >
      <div className="max-w-3xl mx-auto flex justify-center items-center gap-2 sm:gap-3">
        <Input
          placeholder="Search for music..."
          className="text-sm sm:text-base md:text-lg p-4 flex-grow"
          required
          ref={inputRef}
          type="search"
        />
        <button
          type="submit"
          className="p-1 sm:p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Search className="w-5 h-5  md:w-6 md:h-6" />
        </button>
      </div>
    </form>
  );
}
