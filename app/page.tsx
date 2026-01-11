import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, BarChart3, Lock, Zap, Globe, QrCode } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            <Zap className="mr-1 h-3 w-3" />
            Fast & Reliable
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Shorten Links.
            <br />
            <span className="text-primary">Track Performance.</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Create short, memorable links in seconds. Track clicks, analyze traffic, and optimize your sharing strategy with our powerful link management platform.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-base">
                Get Started Free
              </Button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Everything you need to manage links
            </h2>
            <p className="text-muted-foreground">
              Powerful features designed to help you create, manage, and track your shortened links effectively.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Link2 className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Custom Short Links</CardTitle>
                <CardDescription>
                  Create branded, memorable short links that reflect your identity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate custom short codes or let our system create unique, easy-to-share URLs automatically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Click Analytics</CardTitle>
                <CardDescription>
                  Track every click and understand your audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor click counts, traffic sources, and engagement patterns with detailed analytics.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your data is protected with enterprise-grade security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Authenticated access, encrypted connections, and private link management you can trust.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Instant link creation and redirect performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our optimized infrastructure ensures your links redirect users in milliseconds.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Global Reach</CardTitle>
                <CardDescription>
                  Share your links anywhere in the world
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Reliable link service with worldwide accessibility and minimal downtime.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <QrCode className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Easy Management</CardTitle>
                <CardDescription>
                  Organize and control all your links from one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Simple dashboard to create, edit, activate, or deactivate links with ease.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              How it works
            </h2>
            <p className="text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold">Sign Up</h3>
                <p className="text-muted-foreground">
                  Create your free account in seconds with secure authentication
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold">Create Links</h3>
                <p className="text-muted-foreground">
                  Paste your long URL and get a short, shareable link instantly
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold">Track & Share</h3>
                <p className="text-muted-foreground">
                  Share your links and monitor their performance in real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ready to get started?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of users who trust our platform for their link management needs.
            </p>
            <SignUpButton mode="modal">
              <Button size="lg" className="text-base">
                Create Your First Link
              </Button>
            </SignUpButton>
          </div>
        </div>
      </section>
    </div>
  );
}
