"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Target, Users, Zap } from "lucide-react"

const missions = [
  {
    title: "Our Mission",
    description: "To empower small businesses and regional brands in Egypt with an accessible, feature-rich e-commerce platform that bridges the gap between global solutions and local market needs.",
    icon: Target
  },
  {
    title: "Our Vision",
    description: "To become the leading e-commerce platform for small to medium-sized businesses in Egypt, providing innovative solutions that drive digital transformation and economic growth.",
    icon: Zap
  },
  {
    title: "Our Values",
    description: "We believe in making e-commerce accessible to all, providing excellent local support, and maintaining high standards of security and reliability.",
    icon: Users
  }
]

export default function AboutPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About SiteCraft</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          SiteCraft is a low-code e-commerce platform designed specifically for Egyptian small businesses 
          and regional brands, offering a comprehensive solution that combines ease of use with powerful features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {missions.map((mission, index) => (
          <Card key={index} className="border-logo-border">
            <CardContent className="pt-6 ">
              <mission.icon className="h-12 w-12 text-primary mb-4"/>
              <h3 className="text-xl font-semibold mb-2">{mission.title}</h3>
              <p className="text-muted-foreground">{mission.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Why Choose SiteCraft?</h2>
          <p className="text-muted-foreground">
            SiteCraft stands out by addressing the unique challenges faced by Egyptian businesses 
            in the digital space. We offer local payment integration, high-quality Arabic translation, 
            and competitive pricing tailored to the local market. Our platform combines the power of 
            modern e-commerce tools with the simplicity of a low-code interface, making it accessible 
            to businesses of all technical skill levels.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground">
            Born from a graduation project at Cairo University's Faculty of Computers and Artificial Intelligence, 
            SiteCraft was developed by a team of passionate students who recognized the need for a localized 
            e-commerce solution. Our platform is the result of extensive research, market analysis, and 
            collaboration with local businesses to understand and address their specific needs.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
          <p className="text-muted-foreground">
            We are committed to continuous improvement and innovation, regularly updating our platform 
            with new features and enhancements based on user feedback. Our dedicated support team ensures 
            that every business owner has the resources and assistance they need to succeed in the digital marketplace.
          </p>
        </div>
      </div>
    </div>
  )
} 