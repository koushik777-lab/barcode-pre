import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, MessageCircle, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "wouter";

export default function ContactFloatingButton() {
    const [location] = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    if (location.startsWith("/admin")) return null;

    const toggleOpen = () => setIsOpen(!isOpen);

    const phoneNumber = import.meta.env.VITE_CONTACT_PHONE;
    const whatsappUrl = import.meta.env.VITE_CONTACT_WHATSAPP;

    const btnVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.2,
            },
        }),
        exit: { opacity: 0, scale: 0.8, y: 10 },
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            custom={1}
                            variants={btnVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform"
                            aria-label="Contact via WhatsApp"
                        >
                            <FaWhatsapp className="h-6 w-6" />
                        </motion.a>

                        <motion.a
                            href={`tel:${phoneNumber}`}
                            custom={0}
                            variants={btnVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:scale-110 transition-transform"
                            aria-label="Call us"
                        >
                            <Phone className="h-6 w-6" />
                        </motion.a>
                    </>
                )}
            </AnimatePresence>

            <motion.button
                onClick={toggleOpen}
                className={`flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-colors ${isOpen ? "bg-red-500 hover:bg-red-600" : "bg-[#00d26a] hover:bg-[#00b85c]"
                    } text-white`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="h-7 w-7" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="message"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Phone className="h-7 w-7" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
