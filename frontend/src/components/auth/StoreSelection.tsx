'use client'

import { useState } from 'react'
import { useStoreAssignment } from '@/hooks/useStoreAssignment'
import { Button } from '@/components/SiteCraft/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/SiteCraft/ui/card'
import { Alert, AlertDescription } from '@/components/SiteCraft/ui/alert'
import { AlertCircle } from 'lucide-react'

interface Store {
  id: number
  name: string
  description?: string
}

interface StoreSelectionProps {
  userId: number
  stores: Store[]
  onStoreSelected?: (storeId: number) => void
}

export function StoreSelection({ userId, stores, onStoreSelected }: StoreSelectionProps) {
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null)
  const { assignUserToStore, isLoading, error, clearError } = useStoreAssignment()

  const handleStoreSelect = (storeId: number) => {
    setSelectedStoreId(storeId)
    clearError()
  }

  const handleAssignToStore = async () => {
    if (!selectedStoreId) return

    const success = await assignUserToStore(userId, selectedStoreId)
    if (success && onStoreSelected) {
      onStoreSelected(selectedStoreId)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select Your Store</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Choose which store you want to manage:
          </p>
        </div>

        <div className="space-y-2">
          {stores.map((store) => (
            <div
              key={store.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedStoreId === store.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleStoreSelect(store.id)}
            >
              <div className="font-medium">{store.name}</div>
              {store.description && (
                <div className="text-sm text-muted-foreground">{store.description}</div>
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={handleAssignToStore}
          disabled={!selectedStoreId || isLoading}
          className="w-full"
        >
          {isLoading ? 'Assigning...' : 'Assign to Store'}
        </Button>
      </CardContent>
    </Card>
  )
} 