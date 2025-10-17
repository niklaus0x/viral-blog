import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";

const postSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(200, "Title must be less than 200 characters"),
  excerpt: z.string().trim().min(10, "Excerpt must be at least 10 characters").max(500, "Excerpt must be less than 500 characters"),
  content: z.string().trim().min(50, "Content must be at least 50 characters").max(50000, "Content is too long"),
  category: z.string().min(1, "Please select a category"),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to edit posts");
      navigate("/auth");
      return;
    }
    
    fetchPost();
  }, [user, id]);

  const fetchPost = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error("Post not found");
        navigate("/");
        return;
      }

      if (user && data.author_id !== user.id) {
        toast.error("You can only edit your own posts");
        navigate("/");
        return;
      }

      setTitle(data.title);
      setExcerpt(data.excerpt);
      setContent(data.content);
      setCategory(data.category);
      setImageUrl(data.image_url || "");
    } catch (error: any) {
      toast.error("Failed to load post");
      navigate("/");
    } finally {
      setFetching(false);
    }
  };

  const calculateReadTime = (text: string): string => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setLoading(true);

    try {
      const validatedData = postSchema.parse({
        title,
        excerpt,
        content,
        category,
        imageUrl: imageUrl || undefined,
      });

      const { error } = await supabase
        .from("posts")
        .update({
          title: validatedData.title,
          excerpt: validatedData.excerpt,
          content: validatedData.content,
          category: validatedData.category,
          image_url: validatedData.imageUrl || null,
          read_time: calculateReadTime(validatedData.content),
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Post updated successfully!");
      navigate(`/post/${id}`);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to update post");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || fetching) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/post/${id}`)}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Post
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Edit Post</h1>
            <p className="text-muted-foreground">Update your blog post</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter an engaging title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                placeholder="Write a brief summary of your post..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Cover Image URL (optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Updating..." : "Update Post"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/post/${id}`)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
