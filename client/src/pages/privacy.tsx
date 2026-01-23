import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";

export default function Privacy() {
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
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-1000" />

            <Navbar />

            <section className="relative pt-40 pb-20 px-4 md:px-8">
                <div className="container mx-auto max-w-4xl relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold mb-12 font-heading text-glow text-center"
                    >
                        Privacy <span className="text-orange-500 inline-block hover:scale-105 transition-transform duration-300 cursor-default">Policy</span>
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
                                content: "ShopMyBarcode respects your privacy. This policy explains how we collect, use, and protect your personal information when you use our website or services. We are committed to maintaining the confidentiality and security of our users' data."
                            },
                            {
                                title: "2. Information We Collect",
                                content: "We collect information you provide directly to us, such as when you apply for a barcode, contact customer support, or subscribe to our updates. This may include your name, email address, phone number, and company details necessary for processing your request."
                            },
                            {
                                title: "3. How We Use Your Information",
                                content: (
                                    <ul className="list-disc pl-6 space-y-2 marker:text-orange-500">
                                        <li>Process your orders and deliver unique barcode numbers.</li>
                                        <li>Communicate with you regarding your application or inquiries.</li>
                                        <li>Improve our website, services, and user experience.</li>
                                        <li>Comply with legal obligations and prevent fraud.</li>
                                    </ul>
                                )
                            },
                            {
                                title: "4. Data Security",
                                content: "We implement industry-standard security measures, including encryption and secure servers, to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we strive to use commercially acceptable means to protect your data."
                            },
                            {
                                title: "5. Sharing of Information",
                                content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential."
                            },
                            {
                                title: "6. Contact Us",
                                content: "If you have any questions about this Privacy Policy, please contact our Data Protection Officer at support@shopmybarcode.com."
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
                                <div className="border-l-2 border-transparent group-hover:border-orange-500/50 pl-0 group-hover:pl-4 transition-all duration-300">
                                    {typeof item.content === 'string' ? <p>{item.content}</p> : item.content}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
