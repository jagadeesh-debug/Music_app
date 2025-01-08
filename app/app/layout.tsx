import SearchBar from "@/components/SearchBar";

export default function AppLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <>
      <div className="flex justify-evenly">
        {/* <Sidebar /> */}
        <SearchBar />
      </div>
        {children}
    </>
  );
}
