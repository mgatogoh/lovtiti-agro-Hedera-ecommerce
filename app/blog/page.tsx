import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: "The Future of Agriculture: How Blockchain is Revolutionizing Farming",
    excerpt: "Discover how blockchain technology is transforming the agricultural sector in Africa, enabling transparent supply chains and fair trade practices.",
    author: "Dr. Sarah Okafor",
    date: "2024-01-15",
    category: "Technology",
    readTime: "5 min read",
    image: "/api/placeholder/400/250"
  },
  {
    id: 2,
    title: "Sustainable Farming Practices for Small-Scale Farmers",
    excerpt: "Learn about eco-friendly farming techniques that can help small-scale farmers increase yields while protecting the environment.",
    author: "John Mwangi",
    date: "2024-01-10",
    category: "Sustainability",
    readTime: "7 min read",
    image: "/api/placeholder/400/250"
  },
  {
    id: 3,
    title: "Connecting African Farmers to Global Markets",
    excerpt: "Explore how digital platforms are breaking down barriers and connecting African farmers directly with international buyers.",
    author: "Amina Hassan",
    date: "2024-01-05",
    category: "Market Access",
    readTime: "6 min read",
    image: "/api/placeholder/400/250"
  },
  {
    id: 4,
    title: "The Role of Agro Experts in Modern Agriculture",
    excerpt: "Understanding how veterinary professionals are supporting farmers with animal health, equipment leasing, and expert advice.",
    author: "Dr. Michael Chen",
    date: "2024-01-01",
    category: "Veterinary",
    readTime: "8 min read",
    image: "/api/placeholder/400/250"
  },
  {
    id: 5,
    title: "USSD Technology: Bringing Digital Agriculture to Feature Phones",
    excerpt: "How USSD technology is making agricultural services accessible to farmers who only have basic mobile phones.",
    author: "Tech Team",
    date: "2023-12-28",
    category: "Technology",
    readTime: "4 min read",
    image: "/api/placeholder/400/250"
  },
  {
    id: 6,
    title: "Success Stories: Farmers Thriving on Lovtiti Agro Mart",
    excerpt: "Real stories from farmers who have transformed their businesses using our blockchain-powered marketplace.",
    author: "Community Team",
    date: "2023-12-20",
    category: "Success Stories",
    readTime: "9 min read",
    image: "/api/placeholder/400/250"
  }
];

const categories = ["All", "Technology", "Sustainability", "Market Access", "Veterinary", "Success Stories"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Agricultural Insights & News</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Stay updated with the latest trends, technologies, and success stories in African agriculture. 
            Learn from experts and discover how blockchain technology is transforming farming.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className="rounded-full"
              >
                <Tag className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {blogPosts[0].category}
                  </span>
                  <span className="text-gray-500 text-sm">{blogPosts[0].readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {blogPosts[0].title}
                </h3>
                <p className="text-gray-600 mb-4">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{blogPosts[0].author}</span>
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{blogPosts[0].date}</span>
                  </div>
                  <Button>
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Blog Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">{post.author}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-green-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest agricultural insights, 
              market updates, and success stories delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md text-gray-900"
              />
              <Button variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200 mt-12">
          <p className="text-gray-600 mb-4">
            Have a story to share or want to contribute to our blog?
          </p>
          <div className="space-x-4">
            <Link href="/contact">
              <Button variant="outline">Contact Us</Button>
            </Link>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
