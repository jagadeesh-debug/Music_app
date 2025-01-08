import SearchBar from "@/components/SearchBar";

export default function AppLayout() {
  return (
    <>
      <div className="flex justify-evenly">
        {/* <Sidebar /> */}
        <SearchBar />
      </div>
    </>
  );
}
