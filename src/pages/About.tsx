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
            <h1 className="text-5xl font-display font-bold">About Thoughtful Bytes</h1>
            <p className="text-xl text-muted-foreground">
              Where technology meets creativity and innovation
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-lg leading-relaxed">
              Welcome to Thoughtful Bytes, a space dedicated to exploring the ever-evolving landscape 
              of technology, design, and creative thinking. We believe that the best innovations happen 
              at the intersection of different disciplines.
            </p>

            <div className="my-12 p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border">
              <h2 className="text-3xl font-display font-semibold mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed">
                To share insights, spark conversations, and inspire thoughtful approaches to building 
                the digital future. We write about emerging technologies, design principles, and the 
                human side of software development.
              </p>
            </div>

            <h2 className="text-3xl font-display font-semibold mt-12 mb-6">What We Write About</h2>
            
            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="p-6 bg-card rounded-xl border hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-display font-semibold mb-3">Technology</h3>
                <p className="text-muted-foreground">
                  Deep dives into AI, web development, and emerging tech trends
                </p>
              </div>
              
              <div className="p-6 bg-card rounded-xl border hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-display font-semibold mb-3">Design</h3>
                <p className="text-muted-foreground">
                  Exploring UX/UI principles and the art of creating delightful experiences
                </p>
              </div>
              
              <div className="p-6 bg-card rounded-xl border hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-display font-semibold mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  Stories about creativity, problem-solving, and pushing boundaries
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-display font-semibold mt-12 mb-6">Join the Conversation</h2>
            <p className="text-lg leading-relaxed">
              We'd love to hear from you. Whether you have feedback on our articles, suggestions for 
              topics, or just want to say hello, don't hesitate to reach out.
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

export default About;
