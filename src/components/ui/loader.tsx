import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="text-primary flex justify-center items-center">
      <Loader2 className="animate-spin mr-2" size={20} />
      <span>Loading..</span>
    </div>
  );
}
