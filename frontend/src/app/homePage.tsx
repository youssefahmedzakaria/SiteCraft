import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Your brand, Your store, Your way.
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Create stunning websites without writing a single line of code. Our intuitive platform makes web design accessible to everyone.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Drag & Drop</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Build your website by simply dragging and dropping elements. No coding required.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Responsive Design</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Your website will look great on any device, from desktop to mobile.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Customizable</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose from hundreds of templates and customize them to match your brand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
