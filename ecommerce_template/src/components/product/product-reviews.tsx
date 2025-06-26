"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ThemeConfig } from "@/app/product/[slug]/product"
import type { Review } from "@/app/product/[slug]/sample-data"

interface ProductReviewsProps {
  reviews: Review[]
  theme: ThemeConfig
}

export function ProductReviews({ reviews, theme }: ProductReviewsProps) {
  const [reviewsTab, setReviewsTab] = useState("all")

  // Filter reviews based on selected tab
  const filteredReviews = reviews.filter((review) => {
    if (reviewsTab === "all") return true
    if (reviewsTab === "5star") return review.rating === 5
    if (reviewsTab === "4star") return review.rating === 4
    if (reviewsTab === "3star") return review.rating === 3
    if (reviewsTab === "2star") return review.rating === 2
    if (reviewsTab === "1star") return review.rating === 1
    return true
  })

  // Calculate average rating
  const averageRating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length

  // Count reviews by rating
  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  }

  return (
    <section className="mt-20 mb-16">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Review Summary */}
        <div
          className={cn("p-6", theme.borderRadius, "relative")}
          style={{ backgroundColor: `${theme.secondaryColor}20` }}
        >
          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn("w-5 h-5", i < Math.floor(averageRating) ? "fill-current" : "text-gray-300")}
                  style={{ color: i < Math.floor(averageRating) ? theme.secondaryColor : undefined }}
                />
              ))}
            </div>
            <p className="text-sm opacity-75">Based on {reviews.length} reviews</p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  {rating} <Star className="w-4 h-4 fill-current" />
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(ratingCounts[rating as keyof typeof ratingCounts] / reviews.length) * 100}%`,
                      backgroundColor: theme.secondaryColor,
                    }}
                  />
                </div>
                <div className="text-xs opacity-75 w-8 text-right">
                  {ratingCounts[rating as keyof typeof ratingCounts]}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button
              className={cn("w-full group relative")}
              style={{ backgroundColor: theme.secondaryColor, color: theme.backgroundColor }}
            >
              Write a Review
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                  "bg-black/5",
                )}
              />
            </Button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          <Tabs defaultValue="all" onValueChange={setReviewsTab}>
            <TabsList className="bg-white/20">
              <TabsTrigger value="all" className="group relative data-[state=active]:bg-white/30">
                All Reviews
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                    "bg-black/5",
                  )}
                />
              </TabsTrigger>
              <TabsTrigger value="5star" className="group relative data-[state=active]:bg-white/30">
                5 Star
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                    "bg-black/5",
                  )}
                />
              </TabsTrigger>
              <TabsTrigger value="4star" className="group relative data-[state=active]:bg-white/30">
                4 Star
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                    "bg-black/5",
                  )}
                />
              </TabsTrigger>
            </TabsList>

            <TabsContent value={reviewsTab} className="mt-6">
              <div className="space-y-6">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <div
                      key={review.id}
                      className={cn("p-6 border group relative", theme.borderRadius)}
                      style={{ borderColor: `${theme.secondaryColor}30` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {review.avatar ? (
                              <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.author} />
                            ) : null}
                            <AvatarFallback>{review.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{review.author}</div>
                            <div className="text-sm opacity-75">{new Date(review.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                        {review.verified && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 border-green-200"
                            style={{ color: theme.secondaryColor }}
                          >
                            Verified Purchase
                          </Badge>
                        )}
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn("w-4 h-4", i < review.rating ? "fill-current" : "text-gray-300")}
                                style={{ color: i < review.rating ? theme.secondaryColor : undefined }}
                              />
                            ))}
                          </div>
                          <h4 className="font-medium">{review.title}</h4>
                        </div>
                        <p className="opacity-90">{review.comment}</p>
                      </div>
                      <div
                        className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                          theme.borderRadius,
                          "bg-black/5",
                        )}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="opacity-75">No reviews found for this rating.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
