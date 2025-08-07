import { Link, useParams } from "react-router-dom";
import {
  GraduationCap,
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classesApi, eventsApi, rsvpsApi } from "@/lib/database";
import { Event } from "@/lib/supabase";
import { useState } from "react";
import { toast } from "sonner";
import { formatFullDateTime, getTimezoneAbbreviation } from "@/lib/timezone";

export default function ClassCalendar() {
  const { classId } = useParams();
  const classIdNum = parseInt(classId || "0");

  // Fetch class data
  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["class", classIdNum],
    queryFn: () => classesApi.getById(classIdNum),
    enabled: !!classIdNum,
  });

  // Fetch events for this class (showing all for debugging)
  const { data: allEvents = [], isLoading: allEventsLoading } = useQuery({
    queryKey: ["all-events", classIdNum],
    queryFn: () => eventsApi.getByClassId(classIdNum),
    enabled: !!classIdNum,
  });

  // Fetch upcoming events for this class
  const { data: upcomingEvents = [], isLoading: upcomingEventsLoading } =
    useQuery({
      queryKey: ["upcoming-events", classIdNum],
      queryFn: () => eventsApi.getUpcomingByClassId(classIdNum),
      enabled: !!classIdNum,
    });

  const events = upcomingEvents;
  const eventsLoading = allEventsLoading || upcomingEventsLoading;

  const isLoading = classLoading || eventsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                Loading class information...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-destructive">
                Class Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                The requested AP class could not be found.
              </p>
              <Link to="/dashboard">
                <Button>Back to Classes</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classes
            </Button>
          </Link>
        </div>

        {/* Class Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-foreground">
              {classData.name}
            </h1>
            {classData.category && (
              <Badge variant="secondary" className="text-sm">
                {classData.category}
              </Badge>
            )}
          </div>
          <p className="text-xl text-muted-foreground">
            Book your tutoring session and receive expert help (Times shown in your local timezone: {getTimezoneAbbreviation()})
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                No Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                There are currently no upcoming tutoring sessions scheduled for{" "}
                {classData.name}.
              </p>
              <p className="text-sm text-muted-foreground">
                New sessions are added regularly. Check back soon or contact us
                to request a session.
              </p>
              {allEvents.length > 0 && (
                <p className="text-sm text-orange-600">
                  Note: There are {allEvents.length} total events in the
                  database, but none are upcoming.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Header() {
  return (
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
            <Link
              to="/dashboard"
              className="text-foreground hover:text-primary transition-colors"
            >
              Classes
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function EventCard({ event }: { event: Event }) {
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient();

  // Check if user already RSVP'd
  const { data: hasRsvped = false } = useQuery({
    queryKey: ["rsvp-check", event.id, email],
    queryFn: () => rsvpsApi.checkExisting(event.id, email),
    enabled: !!email && email.includes("@"),
  });

  // RSVP mutation
  const rsvpMutation = useMutation({
    mutationFn: () => rsvpsApi.create(event.id, name, email),
    onSuccess: () => {
      toast.success("RSVP confirmed! Your spot is reserved.", {
        description: "Check your email for a confirmation.",
      });
      setRsvpModalOpen(false);
      setName("");
      setEmail("");
      // Refresh the RSVP check
      queryClient.invalidateQueries({ queryKey: ["rsvp-check", event.id] });
    },
    onError: (error) => {
      console.error("RSVP Error:", error);
      toast.error("Failed to RSVP. Please try again.");
    },
  });

  const { date: formattedDate, time: formattedTime, timezone } = formatFullDateTime(event.datetime);

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    rsvpMutation.mutate();
  };

  const meetLink = event.class?.meet_link || "#";

  return (
    <Card className="h-full bg-card/80 backdrop-blur border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg leading-tight">
          {event.description}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{formatDate(eventDate)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span>{formatTime(eventDate)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <a
            href={meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/80 flex items-center"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Google Meet
          </a>

          {hasRsvped ? (
            <Button
              disabled
              size="sm"
              className="bg-green-100 text-green-800 hover:bg-green-100"
            >
              ✓ RSVP'd
            </Button>
          ) : (
            <Dialog open={rsvpModalOpen} onOpenChange={setRsvpModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm">RSVP</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>RSVP for Tutoring Session</DialogTitle>
                  <DialogDescription>
                    Reserve your spot for {event.description}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleRsvp} className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>{formatDate(eventDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>{formatTime(eventDate)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setRsvpModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={rsvpMutation.isPending}
                      className="flex-1"
                    >
                      {rsvpMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        "Confirm RSVP"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
