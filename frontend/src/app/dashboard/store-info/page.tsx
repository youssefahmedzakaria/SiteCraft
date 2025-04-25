import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import Image from "next/image";
import { StorePolicyTableHeader } from "@/components/dashboard/storeInfo/policyTableHeader";
import { StoreAboutTableHeader } from "@/components/dashboard/storeInfo/aboutTableHeader";
import { PolicyRecord } from "@/components/dashboard/storeInfo/policyRecord";
import { AboutRecord } from "@/components/dashboard/storeInfo/aboutRecord";
import { policies, aboutSections } from "@/lib/store-info";

export default function StoreInfoPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold mt-2">Store Info</h1>

        {/* Header section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-4">
          <h2 className="text-lg md:text-xl font-semibold">
            Manage store policies and about us content
          </h2>
        </div>

        {/* Policies Table */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Store Policies</h3>
            <Link href="/dashboard/store-info/policy-add" className="w-full sm:w-auto">
              <Button className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                <Image
                  src="/icons/plus.svg"
                  alt="Add Policy"
                  width={20}
                  height={20}
                />
                <span className="ml-2">Add New Policy</span>
              </Button>
            </Link>
          </div>
          <div className="border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-logo-border">
              <StorePolicyTableHeader />
              <tbody className="bg-white divide-y divide-logo-border">
                {policies.map((policy) => (
                  <PolicyRecord key={policy.id} policy={policy} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* About Us Table */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">About Us</h3>
            <Link href="/dashboard/store-info/about-add" className="w-full sm:w-auto">
              <Button className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                <Image
                  src="/icons/plus.svg"
                  alt="Add Section"
                  width={20}
                  height={20}
                />
                <span className="ml-2">Add New Section</span>
              </Button>
            </Link>
          </div>
          <div className="border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-logo-border">
              <StoreAboutTableHeader />
              <tbody className="bg-white divide-y divide-logo-border">
                {aboutSections.map((section) => (
                  <AboutRecord key={section.id} section={section} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
