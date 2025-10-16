
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddTourTypeMutation } from "@/redux/features/tour/tour.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { z } from "zod"

const formSchema = z.object({
    name: z.string(),
})

const AddTourTypeModal = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });
    const [addTourType] = useAddTourTypeMutation();

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await addTourType({ name: data.name }).unwrap();
            if (res.success) {
                toast.success("Tour Type Added");
            }
        } catch (error) {
            console.log(error);
            toast.error("Already added this tour type!")
        }
    };

    return (
        <div>
            <Dialog>
                <form>
                    <DialogTrigger asChild>
                        <Button >Add Tour Type</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Tour Type</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you&apos;re
                                done.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form id="add-tour-type" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tour Type Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Tour Type Name"
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" form="add-tour-type">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </div>
    );
};

export default AddTourTypeModal;