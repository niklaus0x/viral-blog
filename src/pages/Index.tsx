import { useState } from "react";
import Navigation from "@/components/Navigation";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-blog.jpg";
import postAi from "@/assets/post-ai.jpg";
import postDesign from "@/assets/post-design.jpg";
import postWeb from "@/assets/post-web.jpg";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const categories = ["All", "Technology", "Design", "Development"];
  
  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  // Map imported images to posts
  const postsWithImages = filteredPosts.map(post => ({
    ...post,
    image: post.id === "future-of-ai" ? postAi :
           post.id === "design-thinking-2024" ? postDesign :
           post.id === "web-performance-2024" ? postWeb : post.image
  }));

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-sm font-medium text-primary">Welcome to Thoughtful Bytes</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight">
                Insights on Technology, Design & Innovation
              </h1>
              <p className="text-xl text-muted-foreground">
                Exploring the intersection of creativity and code. Join us on a journey through the digital landscape.
              </p>
              <Button size="lg" className="group">
                Start Reading
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-3xl" />
              <img 
                src={heroImage} 
                alt="Blog hero"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postsWithImages.map(post => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              © 2024 Thoughtful Bytes. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with passion for writing and technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
