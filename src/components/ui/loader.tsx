import { Loader2 } from "lucide-react";

export default function Loader({ size = 20, showLoadingText = true }) {
  return (
    <div className="text-primary flex justify-center items-center">
      <Loader2 className="animate-spin mr-2" size={size} />
      {showLoadingText && <span>Loading..</span>}
    </div>
  );
}
