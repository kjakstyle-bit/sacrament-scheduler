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
        <div className="w-full max-w-md mx-auto bg-white shadow-sm rounded-xl p-4 mb-4 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
                {format(currentDate, "M月d日", { locale: ja })}
            </h2>
            <div className="flex gap-3">
                <Button
                    variant="secondary"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                    onClick={onPrevWeek}
                >
                    前週
                </Button>
                <Button
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium"
                    onClick={onNextWeek}
                >
                    次週
                </Button>
            </div>
        </div>
    )
}
