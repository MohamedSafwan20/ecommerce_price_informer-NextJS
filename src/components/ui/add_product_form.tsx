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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  link: z
    .string()
    .min(1, {
      message: "Link is Required",
    })
    .url({
      message: "Invalid link",
    }),
  store: z
    .string()
    .min(1, {
      message: "Store is Required",
    })
    .refine((value) => value !== "apple", {
      message: "Invalid store",
    }),
  interval: z.coerce
    .number()
    .int()
    .min(1, {
      message: "Interval is Required",
    })
    .gte(0, {
      message: "Invalid interval",
    }),
  orderedPrice: z.coerce
    .number()
    .multipleOf(0.01)
    .min(1, {
      message: "Ordered price is Required",
    })
    .gte(0, {
      message: "Invalid price",
    }),
});

export default function AddProductForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      store: "",
      interval: 30,
      orderedPrice: "",
    },
  });

  function addProduct(values: z.infer<typeof formSchema>) {}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="absolute right-20 bottom-12">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add product to listen for price changes here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(addProduct)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="link"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input type="url" required {...field} />
                    </FormControl>
                    <FormMessage className="font-normal text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="store"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel htmlFor="store">Store</FormLabel>
                    <FormControl>
                      <Select required onValueChange={field.onChange}>
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
                    </FormControl>
                    <FormMessage className="font-normal text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interval"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Interval(Seconds)</FormLabel>
                    <FormControl>
                      <Input type="number" required {...field} />
                    </FormControl>
                    <FormMessage className="font-normal text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orderedPrice"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Ordered Price</FormLabel>
                    <FormControl>
                      <Input type="number" required {...field} />
                    </FormControl>
                    <FormMessage className="font-normal text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
