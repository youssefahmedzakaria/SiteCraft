import { GeneralAnalytic } from '@/lib/categories'

export function GeneralAnalyticsCard({ analytic }: { analytic: GeneralAnalytic }) {
    return (
        <div className="p-4 md:p-6 border rounded-lg border-logo-border bg-white">
        <p className="text-base md:text-lg font-semibold">{analytic.title}</p>
        <h3 className="text-xl font-bold">{analytic.value}</h3>
        <p className="text-base md:text-lg font-semibold">{analytic.subtitle}</p>
      </div>
    )
}