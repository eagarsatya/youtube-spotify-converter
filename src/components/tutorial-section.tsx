import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Search, CheckCircle2 } from 'lucide-react';

export function TutorialSection() {
  const steps = [
    {
      title: "1. Paste a Link",
      description: "Grab a link to any YouTube video or playlist and paste it into the search bar above.",
      icon: <Link className="w-6 h-6 text-blue-500" />
    },
    {
      title: "2. We Match the Tracks",
      description: "Our system automatically cleans the YouTube titles and finds the exact matches on Spotify.",
      icon: <Search className="w-6 h-6 text-amber-500" />
    },
    {
      title: "3. Save to Spotify",
      description: "We generate a public playlist for you. Just open the link and click 'Save' to add it to your library!",
      icon: <CheckCircle2 className="w-6 h-6 text-[#1DB954]" />
    }
  ];

  return (
    <div className="w-full mt-16 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
      <h3 className="text-2xl font-bold text-center mb-8 text-foreground/90">How it works</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors duration-300">
            <CardHeader className="pb-3 text-center">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <CardTitle className="text-lg">{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              {step.description}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="inline-block bg-muted/50 px-4 py-2 rounded-full text-xs text-muted-foreground border border-border/50">
          💡 <strong>Pro tip:</strong> Playlists are automatically cleaned up after 24 hours, so be sure to save them!
        </p>
      </div>
    </div>
  );
}
