import { MessageCircleMore } from 'lucide-react';

const WhatsAppFloat = () => (
  <a
    href="https://wa.me/919999999999"
    target="_blank"
    rel="noreferrer"
    className="fixed bottom-6 right-4 z-40 bg-green-500 text-white rounded-full p-4 shadow-xl"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircleMore className="w-6 h-6" />
  </a>
);

export default WhatsAppFloat;
