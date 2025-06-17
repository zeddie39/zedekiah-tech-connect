import Blog from '../components/Blog';
import { Link, useNavigate } from 'react-router-dom';

export default function BlogPage() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-primary text-accent font-semibold rounded px-4 py-2 border border-accent hover:bg-accent hover:text-primary transition-colors duration-200"
        >
          ← Go Back
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Our Blog</h1>
      <Blog />
    </div>
  );
}
