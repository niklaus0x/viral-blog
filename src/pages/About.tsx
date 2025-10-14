import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Mail, Twitter, Github, Linkedin } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-display font-bold">About Viral</h1>
            <p className="text-xl text-muted-foreground">
              A platform for creators to share ideas that matter
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-lg leading-relaxed">
              Welcome to Viral, a space where creators come together to share their stories, insights, 
              and ideas with the world. We believe in the power of authentic voices and meaningful content.
            </p>

            <div className="my-12 p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border">
              <h2 className="text-3xl font-display font-semibold mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed">
                To empower creators to share their unique perspectives and build a community where 
                ideas can flourish and inspire others. Everyone has a story worth telling.
              </p>
            </div>

            <h2 className="text-3xl font-display font-semibold mt-12 mb-6">What We Write About</h2>
            
            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="p-6 bg-card rounded-xl border hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-display font-semibold mb-3">Diverse Voices</h3>
                <p className="text-muted-foreground">
                  Everyone can share their perspective on any topic that matters to them
                </p>
              </div>
              
              <div className="p-6 bg-card rounded-xl border hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-display font-semibold mb-3">Authentic Stories</h3>
                <p className="text-muted-foreground">
                  Real experiences and genuine insights from creators around the world
                </p>
              </div>
              
              <div className="p-6 bg-card rounded-xl border hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-display font-semibold mb-3">Community First</h3>
                <p className="text-muted-foreground">
                  Building connections and fostering meaningful conversations
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-display font-semibold mt-12 mb-6">Start Creating</h2>
            <p className="text-lg leading-relaxed">
              Join our community of creators. Sign up to start sharing your ideas, stories, and insights 
              with readers around the world. Your voice matters.
            </p>

            <div className="flex gap-4 mt-8">
              <Button variant="outline" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              © 2024 Viral. All rights reserved.
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

export default About;
