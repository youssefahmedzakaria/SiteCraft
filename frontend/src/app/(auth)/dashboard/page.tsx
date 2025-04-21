import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeftNavbar } from "@/components/left-navbar";
import Image from "next/image";
import { Input } from "@/components/ui/input"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <LeftNavbar />

      {/* Main Content */}
      <main className="flex-1 p-6 ml-80 bg-gray-100">
        <h1 className="text-4xl font-bold">
            Products
        </h1>
        {/* hrizontal */}
        <div className="flex justify-between items-center overflow-x-auto">
            <h2 className="text-xl font-semibold">
                Manage your product inventory and details
            </h2>
            <div className="space-x-2">
                <Link href="/signup">
                    <Button
                        className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                    >
                        <Image 
                            src="/icons/plus.svg" 
                            alt="Add Icon" 
                            width={20} 
                            height={20} 
                        />
                        Add New Product
                    </Button>
                </Link>
                <Button 
                    variant="outline"
                    size="lg" 
                    className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                >
                    <Image 
                        src="/icons/dropdown-colored.svg" 
                        alt="Dropdown Icon" 
                        width={20} 
                        height={20} 
                    />
                    Import or Export Products
                </Button>
            </div>
            
        </div>
        {/* hrizontal */}
        <div className="flex justify-between items-stretch gap-4 mt-4">
            <div className="flex-1 p-6 border rounded-lg border-logo-border">
                <p className="text-lg font-semibold">Total Products</p>
                <h3 className="text-xl font-bold">245</h3>
                <p className="text-lg font-semibold">+12 from last month</p>
            </div>
            <div className="flex-1 p-6 border rounded-lg border-logo-border">
                <p className="text-lg font-semibold">Low Stock Items</p>
                <h3 className="text-xl font-bold">8</h3>
                <p className="text-lg font-semibold">Needs attention</p>
            </div>
            <div className="flex-1 p-6 border rounded-lg border-logo-border">
                <p className="text-lg font-semibold">Out of Stock</p>
                <h3 className="text-xl font-bold">3</h3>
                <p className="text-lg font-semibold">Action required</p>
            </div>
        </div>

        {/* vertical */}
        <div className="border-t border-logo-border mt-4">
            {/* hrizontal */}
            <div className="flex justify-between items-stretch gap-4 mt-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <img 
                    src="/icons/search-colored.svg" 
                    alt="Search" 
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none opacity-70"
                    />

                    <Input
                    id="search"
                    name="search"
                    type="search"
                    placeholder="Search: e.g. Watch"
                    autoComplete="search"
                    className="h-10 pl-10 pr-4 bg-background border border-logo-border hover:border-logo-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                    />
                </div>
                <Button
                    variant="outline"
                    size="lg" 
                    className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                >
                    <Image 
                    src="/icons/dropdown-colored.svg" 
                    alt="Dropdown Icon" 
                    width={20} 
                    height={20} 
                    />
                    All Categories
                </Button>
                <Button 
                    variant="outline"
                    size="lg" 
                    className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                >
                    <Image 
                    src="/icons/dropdown-colored.svg" 
                    alt="Dropdown Icon" 
                    width={20} 
                    height={20} 
                    />
                    In Stock
                </Button>
            </div>

        </div>
      </main>
    </div>
  );
}
