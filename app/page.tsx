import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>Home Page</p>
      <Button>
        <Link href="/app">App</Link>
      </Button>
    </div>
  );
}
