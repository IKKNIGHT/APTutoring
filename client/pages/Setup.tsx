import { Link } from 'react-router-dom';
import { GraduationCap, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { databaseSetup } from '@/lib/database';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Setup() {
  const [setupStep, setSetupStep] = useState<'initial' | 'seeding' | 'complete'>('initial');
  const [seedingProgress, setSeedingProgress] = useState({ classes: false, events: false });

  const handleSeedDatabase = async () => {
    setSetupStep('seeding');
    
    try {
      // Seed classes
      await databaseSetup.seedClasses();
      setSeedingProgress(prev => ({ ...prev, classes: true }));
      toast.success('AP classes seeded successfully');

      // Seed sample events
      await databaseSetup.seedSampleEvents();
      setSeedingProgress(prev => ({ ...prev, events: true }));
      toast.success('Sample events created successfully');

      setSetupStep('complete');
      toast.success('Database setup complete!');
    } catch (error) {
      console.error('Seeding error:', error);
      toast.error('Failed to seed database. Check your Supabase configuration.');
      setSetupStep('initial');
    }
  };

  const sqlSchema = databaseSetup.createTables();

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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Database Setup</h1>
          <p className="text-xl text-muted-foreground">Configure your Supabase database for the AP Tutoring Hub</p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Environment Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                First, make sure you have set up your Supabase environment variables:
              </p>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <div>VITE_SUPABASE_URL=https://tutoring.supabase.co</div>
                <div>VITE_SUPABASE_ANON_KEY=your-tutoring-project-anon-key</div>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You can find these values in your Supabase project settings under API.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Step 2: Create Tables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Create Database Tables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Run this SQL script in your Supabase SQL Editor to create the required tables:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                  <code>{sqlSchema}</code>
                </pre>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Go to your Supabase dashboard → SQL Editor → New query, paste the SQL above, and click Run.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Step 3: Seed Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Seed Initial Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Populate your database with the 40 AP classes and sample tutoring events:
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {seedingProgress.classes ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-muted rounded-full" />
                  )}
                  <span className={seedingProgress.classes ? 'text-green-600' : 'text-muted-foreground'}>
                    40 AP Classes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {seedingProgress.events ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-muted rounded-full" />
                  )}
                  <span className={seedingProgress.events ? 'text-green-600' : 'text-muted-foreground'}>
                    Sample Tutoring Events
                  </span>
                </div>
              </div>

              {setupStep === 'complete' ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">Database setup complete!</span>
                </div>
              ) : (
                <Button 
                  onClick={handleSeedDatabase}
                  disabled={setupStep === 'seeding'}
                  className="w-full"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {setupStep === 'seeding' ? 'Seeding Database...' : 'Seed Database'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Step 4: Test Connection */}
          {setupStep === 'complete' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Setup Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Your database is now ready. You can start using the AP Tutoring Hub!
                </p>
                <div className="flex gap-2">
                  <Link to="/dashboard">
                    <Button>View AP Classes</Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline">Back to Home</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
