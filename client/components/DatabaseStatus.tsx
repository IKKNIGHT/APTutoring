import { useQuery } from '@tanstack/react-query';
import { databaseHealth } from '@/lib/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Database } from 'lucide-react';

export function DatabaseStatus() {
  const { data: health, isLoading } = useQuery({
    queryKey: ['database-health'],
    queryFn: databaseHealth.checkTables,
    retry: false
  });

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Checking database status...</p>
        </CardContent>
      </Card>
    );
  }

  if (!health) return null;

  const allTablesExist = health.classes && health.events;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Database className="h-4 w-4" />
          Database Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          {health.classes ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm">Classes table: {health.classes ? 'Ready' : 'Missing'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {health.events ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm">Events table: {health.events ? 'Ready' : 'Missing'}</span>
        </div>

        {!allTablesExist && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <p className="font-medium mb-2">Database setup required</p>
              <p>Run this SQL in your Supabase SQL Editor:</p>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
{`-- Create tables
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  meet_link TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rsvps (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, email)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_class_id ON events(class_id);
CREATE INDEX IF NOT EXISTS idx_events_datetime ON events(datetime);
CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);`}
              </pre>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
