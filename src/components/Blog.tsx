import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BookOpen, Camera, Laptop, Plug, Disc, Smartphone } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from './ui/alert-dialog';


const blogPosts = [
	{
		title: "Essential Phone Maintenance Tips for Longer Device Life",
		excerpt: "Learn simple habits that can extend your smartphone's lifespan and prevent common issues.",
		date: "June 10, 2025",
		category: "Maintenance",
		readTime: "5 min read",
		image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
		fullArticle: `
      To keep your phone running smoothly, regularly clear your cache and close unused apps. 
      Avoid exposing your device to extreme temperatures, as this can damage the battery. 
      Use a protective case and screen protector to prevent physical damage. 
      Finally, be mindful of the apps you install and only download from trusted sources to avoid malware.
    `,
	},
	{
		title: "Home Security: Why CCTV Systems Are Worth the Investment",
		excerpt: "Discover the benefits of professional CCTV installation and how it protects your property.",
		date: "June 8, 2025",
		category: "Security",
		readTime: "7 min read",
		image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80',
		fullArticle: `
      CCTV systems provide a significant deterrent to potential intruders. 
      Modern systems offer remote monitoring, allowing you to check on your property from anywhere. 
      High-quality footage can be crucial for identifying suspects and providing evidence. 
      Professional installation ensures optimal camera placement and system reliability.
    `,
	},
	{
		title: "Signs Your Computer Needs Professional Attention",
		excerpt: "Identify warning signs that indicate it's time to seek professional computer repair services.",
		date: "June 5, 2025",
		category: "Computers",
		readTime: "6 min read",
		image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80',
		fullArticle: `
      If your computer is running unusually slow, frequently crashing, or making strange noises, it's time to get it checked. 
      The "blue screen of death" is a clear indicator of a serious hardware or software issue. 
      Overheating can also cause long-term damage. 
      Don't ignore these signs, as they can lead to data loss or complete system failure.
    `,
	},
	{
		title: "Smart Home Wiring: Planning Your Connected Future",
		excerpt: "A comprehensive guide to preparing your home's electrical infrastructure for smart devices.",
		date: "June 3, 2025",
		category: "Smart Home",
		readTime: "8 min read",
		image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80',
		fullArticle: `
      Proper wiring is the backbone of a reliable smart home. 
      Consider installing neutral wires in all switch boxes to support a wider range of smart switches. 
      Use structured cabling (like Cat6) for high-speed data transfer between devices. 
      A centralized wiring closet can make management and future upgrades much easier.
    `,
	},
	{
		title: "Data Recovery: What You Need to Know",
		excerpt: "Understanding data loss scenarios and recovery options to protect your valuable information.",
		date: "June 1, 2025",
		category: "Data",
		readTime: "6 min read",
		image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80',
		fullArticle: `
      Data loss can happen due to hardware failure, accidental deletion, or software corruption. 
      Regular backups are your first line of defense. 
      If you do lose data, stop using the device immediately to prevent overwriting the lost files. 
      Professional data recovery services have specialized tools to retrieve data from damaged drives.
    `,
	},
	{
		title: "Choosing the Right Tech Consultant for Your Business",
		excerpt: "Key factors to consider when selecting technology consulting services for your company.",
		date: "May 28, 2025",
		category: "Business",
		readTime: "9 min read",
		image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
		fullArticle: `
      A good tech consultant should understand your business goals, not just your technology. 
      Look for a consultant with experience in your industry. 
      Check their references and case studies. 
      A clear communication style and a proactive approach to problem-solving are also essential.
    `,
	}
];

const categoryIcon = {
	'Maintenance': <Smartphone className="text-accent" size={30} />,
	'Security': <Camera className="text-accent" size={30} />,
	'Computers': <Laptop className="text-accent" size={30} />,
	'Smart Home': <Plug className="text-accent" size={30} />,
	'Data': <Disc className="text-accent" size={30} />,
	'Business': <BookOpen className="text-accent" size={30} />,
};

const Blog = () => {
	const [visiblePosts, setVisiblePosts] = useState(3);
	const [selectedPost, setSelectedPost] = useState<(typeof blogPosts)[0] | null>(null);

	const loadMorePosts = () => {
		setVisiblePosts(prev => Math.min(prev + 3, blogPosts.length));
	};

	const openArticle = (post: (typeof blogPosts)[0]) => {
		setSelectedPost(post);
	};

	const closeArticle = () => {
		setSelectedPost(null);
	};

	return (
		<section id="blog" className="py-20 bg-white">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-orbitron font-bold text-primary mb-6 font-playfair">
						Tech Insights & Tips
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
						Stay informed with the latest technology trends, maintenance tips, and expert advice
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{blogPosts.slice(0, visiblePosts).map((post, index) => (
						<Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
							<CardHeader className="pb-4">
								<img
									src={post.image}
									alt={post.title}
									className="rounded-lg w-full h-44 object-cover mb-4"
									loading="lazy"
								/>
								<div className="flex items-center justify-between mb-4">
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
									onClick={() => openArticle(post)}
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

			{selectedPost && (
				<AlertDialog open onOpenChange={closeArticle}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>{selectedPost.title}</AlertDialogTitle>
							<AlertDialogDescription>
								{selectedPost.fullArticle}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={closeArticle}>Close</AlertDialogCancel>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</section>
	);
};

export default Blog;
