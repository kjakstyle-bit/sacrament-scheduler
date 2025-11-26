'use client'

import { useState, useEffect } from 'react'
import { WeekNavigation } from './WeekNavigation'
import { AssignmentList, AssignmentDisplay } from './AssignmentList'
import { addWeeks, subWeeks, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Profile } from '@prisma/client'
import { getAssignments, assignRole, removeAssignment } from '../actions'

import { Member } from '../members/types'

interface ScheduleViewProps {
    user: User | null
    profile: Profile | null
    members: Member[]
}

export function ScheduleView({ user, profile, members }: ScheduleViewProps) {
    const [currentDate, setCurrentDate] = useState(() => {
        const today = new Date()
        const day = today.getDay()
        const daysUntilSunday = (7 - day) % 7
        return addDays(today, daysUntilSunday)
    })
    const [assignments, setAssignments] = useState<AssignmentDisplay[]>([])
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchAssignments = async () => {
            const start = startOfWeek(currentDate, { weekStartsOn: 0 })
            const end = endOfWeek(currentDate, { weekStartsOn: 0 })
            const data = await getAssignments(start, end)

            const ROLES = [
                'パン祝福', '水祝福', 'パス１', 'パス２', 'パス３', 'パス４'
            ]

            const mergedAssignments = ROLES.map((role, index) => {
                const found = data.find(a => a.role === role)
                return found ? { ...found, id: found.id } : { id: `empty-${index}`, role, profile: null }
            })

            setAssignments(mergedAssignments)
        }
        fetchAssignments()
    }, [currentDate])

    const handlePrevWeek = () => setCurrentDate(d => subWeeks(d, 1))
    const handleNextWeek = () => setCurrentDate(d => addWeeks(d, 1))

    const handleAssign = async (role: string, profileId: string) => {
        // if (!profile) return // ログインしていれば操作可能にする（自分の割り当て以外も管理者が行う想定）
        console.log('Assign to', role, profileId)
        const result = await assignRole(currentDate, role, profileId)
        if (result.success) {
            // Refresh data
            const start = startOfWeek(currentDate, { weekStartsOn: 0 })
            const end = endOfWeek(currentDate, { weekStartsOn: 0 })
            const data = await getAssignments(start, end)

            const ROLES = [
                'パン祝福', '水祝福', 'パス１', 'パス２', 'パス３', 'パス４'
            ]
            const mergedAssignments = ROLES.map((role, index) => {
                const found = data.find(a => a.role === role)
                return found ? { ...found, id: found.id } : { id: `empty-${index}`, role, profile: null }
            })
            setAssignments(mergedAssignments)
        }
    }

    const handleRemove = async (id: string) => {
        if (id.startsWith('empty-')) return
        console.log('Remove assignment', id)
        const result = await removeAssignment(id)
        if (result.success) {
            // Refresh data
            const start = startOfWeek(currentDate, { weekStartsOn: 0 })
            const end = endOfWeek(currentDate, { weekStartsOn: 0 })
            const data = await getAssignments(start, end)

            const ROLES = [
                'パン祝福', '水祝福', 'パス１', 'パス２', 'パス３', 'パス４'
            ]
            const mergedAssignments = ROLES.map((role, index) => {
                const found = data.find(a => a.role === role)
                return found ? { ...found, id: found.id } : { id: `empty-${index}`, role, profile: null }
            })
            setAssignments(mergedAssignments)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <div className="min-h-screen pb-20 pt-8">
            <div className="w-full max-w-md mx-auto px-4 mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">聖餐担当表</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">今週の割り当てを確認・編集</p>
                </div>
                {user ? (
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-foreground">{profile?.name || 'ゲスト'}</div>
                            <div className="text-[10px] text-muted-foreground">{user.email}</div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                            ログアウト
                        </Button>
                    </div>
                ) : (
                    <Button variant="default" size="sm" asChild className="shadow-sm">
                        <Link href="/login">ログイン</Link>
                    </Button>
                )}
            </div>

            <div className="px-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md pb-4 pt-2 -mx-4 mb-2 border-b border-border/40 transition-all">
                <div className="max-w-md mx-auto">
                    <WeekNavigation
                        currentDate={currentDate}
                        onPrevWeek={handlePrevWeek}
                        onNextWeek={handleNextWeek}
                    />
                </div>
            </div>

            <div className="px-4 mt-6">
                <AssignmentList
                    assignments={assignments}
                    members={members}
                    onAssign={handleAssign}
                    onRemove={handleRemove}
                />
            </div>
        </div>
    )
}
