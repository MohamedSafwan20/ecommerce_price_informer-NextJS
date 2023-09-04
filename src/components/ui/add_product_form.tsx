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
import { STORES } from "../../config/constants";
import { useAddProductFormStore } from "../../data/stores/add_product_form_store";
import Utils from "../../utils/utils";
import Loader from "./loader";

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
    .refine((value) => STORES.includes(value.toUpperCase()), {
      message: "Invalid store",
    }),
  interval: z.coerce
    .number()
    .int()
    .gte(1, {
      message: "Interval must be greater than or equal to 1",
    })
    .min(1, {
      message: "Interval is Required",
    })
    .lte(59, {
      message: "Interval must be less than or equal to 59",
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
  const { formValues, isDialogOpen, addProduct, updateState, isLoading } =
    useAddProductFormStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: formValues,
  });

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        updateState({
          state: "isDialogOpen",
          value: open,
        });
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="absolute right-10 md:right-20 bottom-6 md:bottom-12 2xl:right-[10rem] 2xl:bottom-28 3xl:right-[30%]"
        >
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
          <form onSubmit={form.handleSubmit((data) => addProduct(data))}>
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
                            {STORES.map((store) => {
                              return (
                                <SelectItem value={store} key={store}>
                                  {Utils.capitalize({
                                    text: store,
                                  })}
                                </SelectItem>
                              );
                            })}
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
                    <FormLabel>Interval(minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        required
                        {...field}
                        placeholder="1-59"
                      />
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
              {isLoading ? <Loader /> : <Button type="submit">Save</Button>}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
