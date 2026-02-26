import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="py-16 text-center">
    <h1 className="text-4xl font-bold">404</h1>
    <p className="mt-3 text-slate-600">Page not found.</p>
    <Link to="/" className="mt-4 inline-block btn-primary">Go Home</Link>
  </div>
);

export default NotFoundPage;
