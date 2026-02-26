import Seo from "../components/ui/Seo";

const ContactPage = () => (
  <>
    <Seo title="Contact" />
    <div className="mx-auto max-w-3xl card">
      <h1 className="text-2xl font-bold">Contact Mahadev Property</h1>
      <p className="mt-3 text-sm text-slate-700">Call us or message us on WhatsApp for instant support.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a href="tel:9876543210" className="btn-primary">Call Now</a>
        <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="btn-outline">WhatsApp</a>
      </div>
      <p className="mt-4 text-sm text-slate-700">Office: Main Road, Ujjain, Madhya Pradesh</p>
    </div>
  </>
);

export default ContactPage;
