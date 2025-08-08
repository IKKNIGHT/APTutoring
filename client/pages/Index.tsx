import { Link } from "react-router-dom";
import { Calendar, GraduationCap, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                AP Tutoring Hub
              </span>
            </div>
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Excel in Your</span>
              <br />
              <span className="text-primary">AP Classes</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get expert tutoring support for all 40 AP subjects. Book
              personalized sessions with experienced tutors and boost your exam
              confidence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6 h-auto">
                <Calendar className="mr-2 h-5 w-5" />
                View AP Tutoring Calendar
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">40</h3>
                <p className="text-muted-foreground">AP Classes Supported</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Expert
                </h3>
                <p className="text-muted-foreground">Certified Tutors</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Flexible
                </h3>
                <p className="text-muted-foreground">Scheduling Options</p>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-20 space-y-12">
            <h2 className="text-3xl font-bold text-center">
              Why Choose Our Tutoring?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-4">
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Easy Scheduling</h3>
                <p className="text-muted-foreground">
                  Browse available sessions and book instantly with automated
                  confirmations and Google Meet links.
                </p>
              </div>
              <div className="text-left space-y-4">
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Subject Experts</h3>
                <p className="text-muted-foreground">
                  Our tutors specialize in specific AP subjects and understand
                  the exam format inside and out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
