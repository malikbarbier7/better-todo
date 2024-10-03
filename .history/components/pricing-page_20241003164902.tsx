'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ListTodo, Check } from "lucide-react"

export function PricingPageComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <ListTodo className="h-6 w-6 mr-2" />
          <span className="font-bold">Minimalist Todo</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple Pricing for Everyone</h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Choose the plan that works best for you. All plans come with our full feature set.
                </p>
              </div>
            </div>
            <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Free Trial</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">€0</div>
                  <p className="text-sm text-gray-500 mt-2">for 1 week</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Full access to all features
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Unlimited tasks and projects
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      7 days of premium support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Start Free Trial</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly</CardTitle>
                  <CardDescription>Flexible month-to-month plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">€5</div>
                  <p className="text-sm text-gray-500 mt-2">per month</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      All features from Free Trial
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Priority customer support
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Advanced analytics
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Choose Monthly</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Annual</CardTitle>
                  <CardDescription>Our best value plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">€4</div>
                  <p className="text-sm text-gray-500 mt-2">per month, billed annually</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      All features from Monthly plan
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Two months free
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Early access to new features
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Choose Annual</Button>
                </CardFooter>
              </Card>
            </div>
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Lifetime Access</h2>
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>One-time Purchase</CardTitle>
                  <CardDescription>Get unlimited access forever</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">€99</div>
                  <p className="text-sm text-gray-500 mt-2">one-time payment</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Lifetime access to all features
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      VIP support
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Future updates included
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Lifetime Access</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Minimalist Todo. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}