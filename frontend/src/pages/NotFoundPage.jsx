import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="grid min-h-[60vh] place-items-center">
    <div className="panel-card max-w-lg p-10 text-center">
      <p className="surface-label">404</p>
      <h1 className="section-heading mt-3 text-5xl">That page has moved off-market.</h1>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        The page you are looking for is not available. Head back to the homepage or continue browsing live listings.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">Go home</Link>
        <Link to="/properties" className="btn-secondary">Explore properties</Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
