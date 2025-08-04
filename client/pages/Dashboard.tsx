import { Link } from 'react-router-dom';
import { GraduationCap, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const apClasses = [
  { id: 1, name: 'AP Calculus AB', category: 'Mathematics', sessions: 12, nextSession: '2025-01-15' },
  { id: 2, name: 'AP Calculus BC', category: 'Mathematics', sessions: 10, nextSession: '2025-01-16' },
  { id: 3, name: 'AP Statistics', category: 'Mathematics', sessions: 8, nextSession: '2025-01-17' },
  { id: 4, name: 'AP Physics 1', category: 'Science', sessions: 15, nextSession: '2025-01-15' },
  { id: 5, name: 'AP Physics 2', category: 'Science', sessions: 12, nextSession: '2025-01-18' },
  { id: 6, name: 'AP Physics C: Mechanics', category: 'Science', sessions: 8, nextSession: '2025-01-19' },
  { id: 7, name: 'AP Physics C: Electricity and Magnetism', category: 'Science', sessions: 7, nextSession: '2025-01-20' },
  { id: 8, name: 'AP Chemistry', category: 'Science', sessions: 18, nextSession: '2025-01-15' },
  { id: 9, name: 'AP Biology', category: 'Science', sessions: 20, nextSession: '2025-01-16' },
  { id: 10, name: 'AP Environmental Science', category: 'Science', sessions: 6, nextSession: '2025-01-21' },
  { id: 11, name: 'AP Computer Science A', category: 'Computer Science', sessions: 14, nextSession: '2025-01-17' },
  { id: 12, name: 'AP Computer Science Principles', category: 'Computer Science', sessions: 11, nextSession: '2025-01-18' },
  { id: 13, name: 'AP English Language and Composition', category: 'English', sessions: 16, nextSession: '2025-01-15' },
  { id: 14, name: 'AP English Literature and Composition', category: 'English', sessions: 14, nextSession: '2025-01-19' },
  { id: 15, name: 'AP United States History', category: 'History', sessions: 22, nextSession: '2025-01-16' },
  { id: 16, name: 'AP World History: Modern', category: 'History', sessions: 18, nextSession: '2025-01-20' },
  { id: 17, name: 'AP European History', category: 'History', sessions: 12, nextSession: '2025-01-21' },
  { id: 18, name: 'AP Art History', category: 'Arts', sessions: 8, nextSession: '2025-01-22' },
  { id: 19, name: 'AP Music Theory', category: 'Arts', sessions: 6, nextSession: '2025-01-23' },
  { id: 20, name: 'AP Studio Art: Drawing', category: 'Arts', sessions: 5, nextSession: '2025-01-24' },
  { id: 21, name: 'AP Studio Art: 2-D Design', category: 'Arts', sessions: 4, nextSession: '2025-01-25' },
  { id: 22, name: 'AP Studio Art: 3-D Design', category: 'Arts', sessions: 3, nextSession: '2025-01-26' },
  { id: 23, name: 'AP Spanish Language and Culture', category: 'World Languages', sessions: 10, nextSession: '2025-01-17' },
  { id: 24, name: 'AP Spanish Literature and Culture', category: 'World Languages', sessions: 7, nextSession: '2025-01-18' },
  { id: 25, name: 'AP French Language and Culture', category: 'World Languages', sessions: 8, nextSession: '2025-01-19' },
  { id: 26, name: 'AP German Language and Culture', category: 'World Languages', sessions: 5, nextSession: '2025-01-20' },
  { id: 27, name: 'AP Italian Language and Culture', category: 'World Languages', sessions: 4, nextSession: '2025-01-21' },
  { id: 28, name: 'AP Chinese Language and Culture', category: 'World Languages', sessions: 6, nextSession: '2025-01-22' },
  { id: 29, name: 'AP Japanese Language and Culture', category: 'World Languages', sessions: 5, nextSession: '2025-01-23' },
  { id: 30, name: 'AP Latin', category: 'World Languages', sessions: 4, nextSession: '2025-01-24' },
  { id: 31, name: 'AP Psychology', category: 'Social Sciences', sessions: 16, nextSession: '2025-01-16' },
  { id: 32, name: 'AP Human Geography', category: 'Social Sciences', sessions: 12, nextSession: '2025-01-17' },
  { id: 33, name: 'AP Macroeconomics', category: 'Social Sciences', sessions: 9, nextSession: '2025-01-18' },
  { id: 34, name: 'AP Microeconomics', category: 'Social Sciences', sessions: 8, nextSession: '2025-01-19' },
  { id: 35, name: 'AP United States Government and Politics', category: 'Social Sciences', sessions: 11, nextSession: '2025-01-20' },
  { id: 36, name: 'AP Comparative Government and Politics', category: 'Social Sciences', sessions: 7, nextSession: '2025-01-21' },
  { id: 37, name: 'AP Seminar', category: 'AP Capstone', sessions: 6, nextSession: '2025-01-22' },
  { id: 38, name: 'AP Research', category: 'AP Capstone', sessions: 5, nextSession: '2025-01-23' },
  { id: 39, name: 'AP Precalculus', category: 'Mathematics', sessions: 9, nextSession: '2025-01-24' },
  { id: 40, name: 'AP African American Studies', category: 'Social Sciences', sessions: 8, nextSession: '2025-01-25' }
];

const categories = [...new Set(apClasses.map(cls => cls.category))];

export default function Dashboard() {
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
              <Link to="/dashboard" className="text-primary font-medium">Classes</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">AP Classes</h1>
          <p className="text-xl text-muted-foreground">Choose from 40 AP subjects and book your tutoring session</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{apClasses.length}</p>
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
                  <p className="text-2xl font-bold">{apClasses.reduce((sum, cls) => sum + cls.sessions, 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
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
          {apClasses.map((apClass) => (
            <Link key={apClass.id} to={`/class/${apClass.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-card/80 backdrop-blur border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {apClass.category}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{apClass.sessions}</p>
                      <p className="text-xs text-muted-foreground">sessions</p>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{apClass.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Next: {new Date(apClass.nextSession).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-600 font-medium">Available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
