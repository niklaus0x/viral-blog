import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, Share2, Eye, Twitter, Facebook, Linkedin, Link2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-blog.jpg";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { blogPosts } from "@/data/blogPosts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author_name: string;
  author_id?: string;
  image_url?: string | null;
  read_time: string;
  created_at: string;
  view_count?: number;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
      incrementViewCount();
    }
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      setPost(data);
    } catch (error: any) {
      toast.error("Failed to load post");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!id) return;

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error("Failed to load comments:", error);
    }
  };

  const incrementViewCount = async () => {
    if (!id) return;

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: currentPost } = await supabase
        .from("posts")
        .select("view_count")
        .eq("id", id)
        .maybeSingle();

      if (currentPost) {
        await supabase
          .from("posts")
          .update({ view_count: (currentPost.view_count || 0) + 1 })
          .eq("id", id);
      }
    } catch (error: any) {
      console.error("Failed to increment view count:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post || !newComment.trim()) return;

    setSubmittingComment(true);

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase
        .from("comments")
        .insert({
          post_id: post.id,
          user_id: user.id,
          author_name: user.email?.split("@")[0] || "Anonymous",
          content: newComment.trim(),
        });

      if (error) throw error;

      toast.success("Comment added!");
      setNewComment("");
      fetchComments();
    } catch (error: any) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast.success("Comment deleted");
      fetchComments();
    } catch (error: any) {
      toast.error("Failed to delete comment");
      console.error(error);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id);

      if (error) throw error;

      toast.success("Post deleted");
      navigate("/");
    } catch (error: any) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";
    
    let shareUrl = "";
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
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

  const postImage = post.image_url || heroImage;
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const isAuthor = user?.id === post.author_id;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
            
            {isAuthor && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/edit/${post.id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePost}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          
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
                {post.author_name}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.read_time}
              </span>
              {post.view_count !== undefined && (
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {post.view_count} views
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 pt-4">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share:
              </span>
              <Button variant="ghost" size="sm" onClick={() => handleShare("twitter")}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleShare("facebook")}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleShare("linkedin")}>
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleShare("copy")}>
                <Link2 className="h-4 w-4" />
              </Button>
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
          
          <Separator className="my-12" />
          
          {/* Comments Section */}
            <div className="mt-16">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-display">
                    Comments ({comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {user ? (
                    <form onSubmit={handleSubmitComment} className="space-y-4">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows={4}
                        required
                      />
                      <Button type="submit" disabled={submittingComment}>
                        {submittingComment ? "Posting..." : "Post Comment"}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-8 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground mb-4">Sign in to leave a comment</p>
                      <Button onClick={() => navigate("/auth")}>Sign In</Button>
                    </div>
                  )}

                  {comments.length > 0 && (
                    <div className="space-y-4 mt-8">
                      {comments.map((comment) => (
                        <Card key={comment.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold">{comment.author_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(comment.created_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                              {user?.id === comment.user_id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteComment(comment.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <p className="text-foreground/90 whitespace-pre-line">{comment.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          
          <div className="mt-16 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Written by</p>
                <p className="font-display text-xl font-semibold">{post.author_name}</p>
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
