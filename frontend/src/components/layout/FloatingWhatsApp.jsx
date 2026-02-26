import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsApp = () => {
  const phone = import.meta.env.VITE_DEFAULT_WHATSAPP || "917692016188";
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
};

export default FloatingWhatsApp;
