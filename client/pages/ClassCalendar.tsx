import { Link, useParams } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClassCalendar() {
  const { classId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">AP Tutoring Hub</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">Classes</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classes
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Class Calendar - Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              This page will show the calendar for class ID: {classId}
            </p>
            <p className="text-sm text-muted-foreground">
              Features coming soon:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• View tutoring session dates and times</li>
              <li>• RSVP for sessions</li>
              <li>• Automatic email confirmations</li>
              <li>• Google Meet links</li>
            </ul>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Continue prompting to have me implement this page's functionality!
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
