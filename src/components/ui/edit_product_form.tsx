import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3 } from "lucide-react";

export default function EditProductForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Edit3
          className="h-4 w-4"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Make changes to product here.</DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center flex-col gap-y-2">
              <Label htmlFor="link" className="ml-1">
                Link
              </Label>
              <Input
                id="link"
                className="col-span-3"
                autoFocus
                type="url"
                required
              />
            </div>
            <div className="flex justify-center flex-col gap-y-2">
              <Label htmlFor="store" className="ml-1">
                Store
              </Label>
              <Select required>
                <SelectTrigger id="store">
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center flex-col gap-y-2">
              <Label htmlFor="interval" className="ml-1">
                Interval
              </Label>
              <Input
                id="interval"
                className="col-span-3"
                type="number"
                required
              />
            </div>
            <div className="flex justify-center flex-col gap-y-2">
              <Label htmlFor="orderedPrice" className="ml-1">
                Ordered Price
              </Label>
              <Input
                id="orderedPrice"
                className="col-span-3"
                type="number"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
