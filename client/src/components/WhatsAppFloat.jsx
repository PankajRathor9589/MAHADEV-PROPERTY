import { MessageCircleMore } from "lucide-react";

const fallbackNumber = import.meta.env.VITE_DEFAULT_WHATSAPP || "919876543210";

const WhatsAppFloat = () => {
  return (
    <a
      href={`https://wa.me/${fallbackNumber}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircleMore size={18} />
      WhatsApp
    </a>
  );
};

export default WhatsAppFloat;
