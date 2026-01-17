import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ApplyBarcodeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface ApplicationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    productDetails: string;
}

export function ApplyBarcodeModal({ open, onOpenChange }: ApplyBarcodeModalProps) {
    const { toast } = useToast();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ApplicationData>();

    const mutation = useMutation({
        mutationFn: async (data: ApplicationData) => {
            const res = await apiRequest("POST", "/api/applications", data);
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "Application Submitted",
                description: "We have received your request and will contact you shortly.",
            });
            reset();
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to submit application",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: ApplicationData) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-primary">Get Your Barcodes</DialogTitle>
                    <DialogDescription className="text-center">
                        Fill in your details below to start the process. Instant delivery upon approval.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                {...register("firstName", { required: "First name is required" })}
                                placeholder="John"
                            />
                            {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                {...register("lastName", { required: "Last name is required" })}
                                placeholder="Doe"
                            />
                            {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                            placeholder="john@example.com"
                        />
                        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            {...register("phone", { required: "Phone is required" })}
                            placeholder="+91 9876543210"
                        />
                        {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                            id="companyName"
                            {...register("companyName", { required: "Company name is required" })}
                            placeholder="Your Brand Pvt Ltd"
                        />
                        {errors.companyName && <span className="text-xs text-red-500">{errors.companyName.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="productDetails">Product Overview</Label>
                        <Textarea
                            id="productDetails"
                            {...register("productDetails", { required: "Please briefly describe your products" })}
                            placeholder="E.g. I need barcodes for 5 flavors of potato chips..."
                        />
                        {errors.productDetails && <span className="text-xs text-red-500">{errors.productDetails.message}</span>}
                    </div>

                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2" disabled={mutation.isPending}>
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Application"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
