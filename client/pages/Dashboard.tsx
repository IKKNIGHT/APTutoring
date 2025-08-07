import { Link } from "react-router-dom";
import { GraduationCap, Calendar, Users, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { classesApi, eventsApi } from "@/lib/database";
import { Class } from "@/lib/supabase";
import {
  formatCompactDate,
  getUserTimezone,
  getTimezoneAbbreviation,
} from "@/lib/timezone";

export default function Dashboard() {
  // Fetch classes from Supabase
  const {
    data: classes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: classesApi.getAll,
  });

  // Get categories from the classes data
  const categories = [
    ...new Set(classes.map((cls) => cls.category).filter(Boolean)),
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  AP Tutoring Hub
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  to="/"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link to="/dashboard" className="text-primary font-medium">
                  Classes
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading AP classes...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  AP Tutoring Hub
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  to="/"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link to="/dashboard" className="text-primary font-medium">
                  Classes
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-destructive">
                Error Loading Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Unable to load AP classes. Please check your Supabase
                configuration.
              </p>
              <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                <p className="font-medium">To set up Supabase:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Create a Supabase project</li>
                  <li>
                    Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment
                    variables
                  </li>
                  <li>
                    Run the database setup SQL in your Supabase SQL editor
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                AP Tutoring Hub
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link to="/dashboard" className="text-primary font-medium">
                Classes
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            AP Classes
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Choose from {classes.length} AP subjects and book your tutoring
            session
          </p>
          <p className="text-sm text-muted-foreground">
            📍 Times shown in your timezone: {getUserTimezone()} (
            {getTimezoneAbbreviation()})
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{classes.length}</p>
                  <p className="text-sm text-muted-foreground">AP Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">Live</p>
                  <p className="text-sm text-muted-foreground">Session Data</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{categories.length}</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm text-muted-foreground">Availability</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classes.map((apClass) => (
            <ClassCard key={apClass.id} apClass={apClass} />
          ))}
        </div>
      </main>
    </div>
  );
}

function ClassCard({ apClass }: { apClass: Class }) {
  // Fetch upcoming events for this class
  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events", apClass.id],
    queryFn: () => eventsApi.getUpcomingByClassId(apClass.id),
    retry: 1,
  });

  const nextEvent = events[0];
  const nextSession = nextEvent ? formatCompactDate(nextEvent.datetime) : "TBA";
  const hasUpcomingSessions = events.length > 0;

  return (
    <Link to={`/class/${apClass.id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-card/80 backdrop-blur border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {apClass.category && (
                <Badge variant="secondary" className="text-xs">
                  {apClass.category}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                ID: {apClass.id}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-primary">
                {isLoading ? "..." : events.length}
              </p>
              <p className="text-xs text-muted-foreground">sessions</p>
            </div>
          </div>
          <CardTitle className="text-lg leading-tight">
            {apClass.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Next: {nextSession}
            </div>
            <div className="flex items-center text-sm">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  error
                    ? "bg-red-500"
                    : hasUpcomingSessions
                      ? "bg-green-500"
                      : "bg-yellow-500"
                }`}
              ></div>
              <span
                className={`font-medium ${
                  error
                    ? "text-red-600"
                    : hasUpcomingSessions
                      ? "text-green-600"
                      : "text-yellow-600"
                }`}
              >
                {error
                  ? "Error Loading"
                  : hasUpcomingSessions
                    ? "Available"
                    : "Coming Soon"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
