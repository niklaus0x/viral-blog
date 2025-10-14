import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import postAi from "@/assets/post-ai.jpg";
import postDesign from "@/assets/post-design.jpg";
import postWeb from "@/assets/post-web.jpg";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const post = blogPosts.find(p => p.id === id);
  
  if (!post) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Post Not Found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const postImage = post.id === "future-of-ai" ? postAi :
                    post.id === "design-thinking-2024" ? postDesign :
                    post.id === "web-performance-2024" ? postWeb : post.image;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              {post.category}
            </Badge>
            
            <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
            
            <div className="aspect-[16/9] rounded-2xl overflow-hidden">
              <img 
                src={postImage} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="mt-8 whitespace-pre-line leading-relaxed">
                {post.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-3xl font-display font-semibold mt-12 mb-4">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-2xl font-display font-semibold mt-8 mb-3">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.trim() === '') {
                    return <div key={index} className="h-4" />;
                  }
                  return (
                    <p key={index} className="text-foreground/90 mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Written by</p>
                <p className="font-display text-xl font-semibold">{post.author}</p>
              </div>
              <Button onClick={() => navigate("/")}>
                More Articles
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
