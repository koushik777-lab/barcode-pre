import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ApplyBarcode() {
    const { toast } = useToast();
    const [, setLocation] = useLocation();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        companyName: "",
        productDetails: ""
    });

    const mutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await apiRequest("POST", "/api/applications", data);
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "Application Submitted",
                description: "We have received your request and will contact you shortly.",
            });
            // Optional: redirect to home or thank you page
            setLocation("/");
        },
        onError: (err: any) => {
            toast({
                title: "Submission Error",
                description: err.message,
                variant: "destructive",
            });
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Get Your Official Barcode
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Register your products with globally recognized barcodes.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Application Form</CardTitle>
                        <CardDescription>Please fill in your details below to apply for a barcode assignment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company / Brand Name</Label>
                                <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="productDetails">Product Description / Details</Label>
                                <Textarea
                                    id="productDetails"
                                    name="productDetails"
                                    placeholder="Briefly describe the products you need barcodes for..."
                                    className="min-h-[100px]"
                                    value={formData.productDetails}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Separator className="my-6" />

                            <Button type="submit" size="lg" className="w-full text-lg" disabled={mutation.isPending}>
                                {mutation.isPending ? "Submitting Application..." : "Submit Application"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
