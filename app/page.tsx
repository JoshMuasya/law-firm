import Dashboard from "@/components/Dashboard";
import Welcome from "@/components/ui/Welcome";

export default function Home() {
  return (
    <div className="w-full h-screen dash-back flex flex-col justify-center align-middle items-center">
      <Dashboard />
    </div>
  );
}
