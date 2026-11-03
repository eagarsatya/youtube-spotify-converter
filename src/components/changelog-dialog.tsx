'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CHANGELOG_DATA, CURRENT_VERSION, ChangeEntry } from '@/data/changelog';
import { Sparkles, Calendar, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

interface ChangelogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getBadgeVariant(type: ChangeEntry['type']) {
  switch (type) {
    case 'feat':
      return {
        label: 'New',
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      };
    case 'improvement':
      return {
        label: 'Improvement',
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      };
    case 'fix':
      return {
        label: 'Fix',
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      };
    case 'refactor':
      return {
        label: 'Refactor',
        className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      };
    default:
      return {
        label: 'Update',
        className: 'bg-muted text-muted-foreground border-border',
      };
  }
}

export function ChangelogDialog({ open, onOpenChange }: ChangelogDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b">
          <DialogHeader className="gap-1.5 text-left">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  What&apos;s New
                  <Badge variant="secondary" className="font-mono text-xs font-semibold px-2">
                    v{CURRENT_VERSION}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Recent updates, new features, and improvements to Playlist Converter.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Timeline */}
        <div className="overflow-y-auto px-6 py-4 space-y-8 flex-1">
          {CHANGELOG_DATA.map((release) => (
            <div key={release.version} className="relative pl-6 border-l-2 border-border/80">
              {/* Timeline marker */}
              <div
                className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center ${release.isLatest ? 'border-primary' : 'border-muted-foreground/40'
                  }`}
              >
                {release.isLatest && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </div>

              {/* Version Header */}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="font-mono font-bold text-base tracking-tight">
                  v{release.version}
                </span>

                {release.isLatest && (
                  <Badge className="bg-primary/15 text-primary border-primary/20 hover:bg-primary/20 text-[10px] font-semibold px-1.5 py-0">
                    Latest
                  </Badge>
                )}

                <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{release.releaseDate}</span>
                </div>
              </div>

              <h3 className="font-semibold text-sm text-foreground/90 mb-1">
                {release.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {release.description}
              </p>

              {/* List of changes */}
              <ul className="space-y-2 mt-2">
                {release.changes.map((change, idx) => {
                  const badge = getBadgeVariant(change.type);
                  return (
                    <li key={idx} className="text-xs flex items-start gap-2 leading-relaxed">
                      <span
                        className={`inline-flex shrink-0 items-center justify-center px-1.5 py-0.5 text-[10px] font-medium rounded border ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-foreground/80">{change.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
          <a
            href="https://github.com/eagarsatya/youtube-spotify-converter/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
          >
            <FaGithub className="w-3.5 h-3.5" />
            <span>Full CHANGELOG.md</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer h-8 text-xs"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
