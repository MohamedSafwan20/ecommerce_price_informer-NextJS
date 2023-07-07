import { Skeleton } from "./skeleton";

export default function ProductAccordionSkeleton() {
  return [1, 2, 3, 4, 5, 6].map((index) => {
    return (
      <div className="flex items-center w-full mb-4" key={index}>
        <div className="flex justify-center gap-6">
          <Skeleton className="w-[90px] h-[70px] rounded" />
          <div className="space-y-3">
            <Skeleton className="w-[50ch] h-4" />
            <div className="flex gap-3">
              <div className="flex items-start flex-col gap-2">
                <Skeleton className="w-[10ch]  h-4" />
                <Skeleton className="w-[6ch]  h-4" />
              </div>
              <div className="flex items-start flex-col gap-2">
                <Skeleton className="w-[10ch]  h-4" />
                <Skeleton className="w-[6ch]  h-4" />
              </div>
              <div className="flex items-start flex-col gap-2">
                <Skeleton className="w-[10ch]  h-4" />
                <Skeleton className="w-[6ch]  h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
}
