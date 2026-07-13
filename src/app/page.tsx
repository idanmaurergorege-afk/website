import { Nav } from "@/components/Nav";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <Nav />
      <Dashboard />
    </div>
  );
}
