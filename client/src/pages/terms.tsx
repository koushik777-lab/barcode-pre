import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";

export default function Terms() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative font-sans overflow-hidden">
            {/* Background Ambience */}
            <div className="premium-bg opacity-60" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-1000" />

            <Navbar />

            <section className="relative pt-40 pb-20 px-4 md:px-8">
                <div className="container mx-auto max-w-4xl relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold mb-12 font-heading text-glow text-center"
                    >
                        Terms & <span className="text-orange-500 inline-block hover:scale-105 transition-transform duration-300 cursor-default">Conditions</span>
                    </motion.h1>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="glass-premium p-8 md:p-12 rounded-3xl border border-white/5 space-y-10 text-gray-300 leading-relaxed shadow-2xl backdrop-blur-xl"
                    >
                        {[
                            {
                                title: "1. Introduction",
                                content: "Welcome to ShopMyBarcode. By accessing our website and using our services, you agree to be bound by these Terms & Conditions. Please read them carefully. We are dedicated to providing a seamless experience for all our users."
                            },
                            {
                                title: "2. Services",
                                content: "ShopMyBarcode provides verified digital barcode numbers (EAN/UPC) specifically for retail use. Our codes are unique, GS1-compliant, and ready for global marketplaces. We do not sell physical barcode labels unless explicitly stated in a specific package."
                            },
                            {
                                title: "3. License & Ownership",
                                content: "Upon purchase, the barcode numbers are permanently transferred to you. You maintain full ownership and are free to use them for your products globally. ShopMyBarcode retains no claim over the codes once sold, ensuring your complete autonomy."
                            },
                            {
                                title: "4. Refund Policy",
                                content: "Due to the nature of digital goods, we cannot offer refunds once the barcodes have been issued or emailed, as they cannot be 'returned' or revoked. Please verify your specific requirements and retailer compatibility before finalizing your purchase."
                            },
                            {
                                title: "5. Limitation of Liability",
                                content: "ShopMyBarcode shall not be liable for any indirect, incidental, or consequential damages arising from the use of our barcodes. While we ensure validity, it is the user's responsibility to confirm compliance with any specific retailer's unique requirements."
                            },
                            {
                                title: "6. Contact",
                                content: "We are here to help. For any questions regarding these terms, please contact our support team at support@shopmybarcode.com."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group p-4 hover:bg-white/5 rounded-xl transition-colors duration-300"
                            >
                                <h2 className="text-2xl font-bold text-white font-heading mb-3 group-hover:text-orange-400 transition-colors">
                                    {item.title}
                                </h2>
                                <p className="border-l-2 border-transparent group-hover:border-orange-500/50 pl-0 group-hover:pl-4 transition-all duration-300">
                                    {item.content}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
