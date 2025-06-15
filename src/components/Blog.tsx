
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BookOpen, Camera, Laptop, Plug, Disc, Smartphone, Search } from 'lucide-react';

const Blog = () => {
  const [visiblePosts, setVisiblePosts] = useState(3);

  // Map category to lucide icon
  const categoryIcon = {
    'Maintenance': <Smartphone className="text-accent" size={30} />,
    'Security': <Camera className="text-accent" size={30} />,
    'Computers': <Laptop className="text-accent" size={30} />,
    'Smart Home': <Plug className="text-accent" size={30} />,
    'Data': <Disc className="text-accent" size={30} />,
    'Business': <BookOpen className="text-accent" size={30} />,
  };

  const blogPosts = [
    {
      title: "Essential Phone Maintenance Tips for Longer Device Life",
      excerpt: "Learn simple habits that can extend your smartphone's lifespan and prevent common issues.",
      date: "June 10, 2025",
      category: "Maintenance",
      readTime: "5 min read",
    },
    {
      title: "Home Security: Why CCTV Systems Are Worth the Investment",
      excerpt: "Discover the benefits of professional CCTV installation and how it protects your property.",
      date: "June 8, 2025",
      category: "Security",
      readTime: "7 min read",
    },
    {
      title: "Signs Your Computer Needs Professional Attention",
      excerpt: "Identify warning signs that indicate it's time to seek professional computer repair services.",
      date: "June 5, 2025",
      category: "Computers",
      readTime: "6 min read",
    },
    {
      title: "Smart Home Wiring: Planning Your Connected Future",
      excerpt: "A comprehensive guide to preparing your home's electrical infrastructure for smart devices.",
      date: "June 3, 2025",
      category: "Smart Home",
      readTime: "8 min read",
    },
    {
      title: "Data Recovery: What You Need to Know",
      excerpt: "Understanding data loss scenarios and recovery options to protect your valuable information.",
      date: "June 1, 2025",
      category: "Data",
      readTime: "6 min read",
    },
    {
      title: "Choosing the Right Tech Consultant for Your Business",
      excerpt: "Key factors to consider when selecting technology consulting services for your company.",
      date: "May 28, 2025",
      category: "Business",
      readTime: "9 min read",
    }
  ];

  const loadMorePosts = () => {
    setVisiblePosts(prev => Math.min(prev + 3, blogPosts.length));
  };

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-primary mb-6">
            Tech Insights & Tips
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest technology trends, maintenance tips, and expert advice
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(0, visiblePosts).map((post, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  {/* ICON */}
                  <span className="">{categoryIcon[post.category as keyof typeof categoryIcon]}</span>
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="text-xl font-orbitron text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                >
                  Read Article
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {visiblePosts < blogPosts.length && (
          <div className="text-center mt-12">
            <Button 
              onClick={loadMorePosts}
              className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-200"
            >
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
