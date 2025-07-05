import Image from "next/image";
import { Button } from "@/components/SiteCraft/ui/button";
import Link from "next/link";
import { siteCraftCache } from "@/lib/cache";
import { commitCachedRegistration } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export interface Template {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
}

export function TemplateCard({ template }: { template: Template }) {
  const router = useRouter();
  const [isCommitting, setIsCommitting] = useState(false);
  const { checkSession } = useAuth();

  const handleTemplateSelect = async () => {
    setIsCommitting(true);
    try {
      console.log('🎯 Template selected:', template);
      
      // Get cached data
      const cachedData = siteCraftCache.getData();
      if (!cachedData.user || !cachedData.store) {
        throw new Error('Missing cached registration data');
      }
      
      console.log('📦 Cached data found:', cachedData);
      
      // Commit all cached data to database
      const result = await commitCachedRegistration({
        user: cachedData.user,
        store: cachedData.store,
        template: template // Pass template info but don't save to cache
      });
      
      console.log('✅ Registration committed successfully:', result);
      
      // Clear cache after successful commit
      siteCraftCache.clearCache();
      
      // Refresh session to get updated store status
      console.log('🔄 Refreshing session after registration...');
      await checkSession();
      console.log('✅ Session refreshed with updated store status');
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('❌ Error committing registration:', error);
      alert('Failed to complete registration. Please try again.');
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="border border-black-border rounded-lg overflow-hidden shadow-sm bg-background transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative w-full h-40">
        <Image
          src={template.imageUrl}
          alt={template.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-black ">{template.title}</h2>
        <p className="text-sm text-muted-foreground mb-2">
          {template.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-black">
            ⭐ {template.rating.toFixed(1)}
          </span>
          <div className="space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-logo-light-button-hover hover:bg-gray-100 transition-colors"
            >
              Preview
            </Button>
            <Button
              size="sm"
              className="bg-black text-primary-foreground hover:bg-gray-800 transition-colors"
              onClick={handleTemplateSelect}
              disabled={isCommitting}
            >
              {isCommitting ? 'Creating...' : 'Select'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
