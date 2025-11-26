'use client'

import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

interface WeekNavigationProps {
    currentDate: Date
    onPrevWeek: () => void
    onNextWeek: () => void
}

export function WeekNavigation({ currentDate, onPrevWeek, onNextWeek }: WeekNavigationProps) {
    return (
        <div className="w-full max-w-md mx-auto bg-card shadow-sm rounded-xl p-4 mb-4 border border-border/50">
            <h2 className="text-2xl font-bold text-foreground mb-3 text-center">
                {format(currentDate, "M月d日", { locale: ja })}
            </h2>
            <div className="flex gap-3">
                <Button
                    variant="secondary"
                    className="flex-1 bg-muted/50 hover:bg-muted text-foreground font-medium rounded-lg h-9 transition-colors"
                    onClick={onPrevWeek}
                >
                    前週
                </Button>
                <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg h-9 shadow-sm transition-colors"
                    onClick={onNextWeek}
                >
                    次週
                </Button>
            </div>
        </div>
    )
}
