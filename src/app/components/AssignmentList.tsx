import { Member } from "@/app/members/types"
import { X } from "lucide-react"
import { Card } from "@/components/ui/card"

export type AssignmentDisplay = {
    id: string
    role: string
    profile?: {
        id: string
        name: string
    } | null
}

interface AssignmentListProps {
    assignments: AssignmentDisplay[]
    members: Member[]
    onAssign: (role: string, profileId: string) => void
    onRemove: (assignmentId: string) => void
}

export function AssignmentList({ assignments, members, onAssign, onRemove }: AssignmentListProps) {
    // 既に割り当てられているメンバーのIDリストを作成
    const assignedMemberIds = assignments
        .filter(a => a.profile)
        .map(a => a.profile!.id)

    const getFilteredMembers = (role: string) => {
        let filtered = members

        // 役割によるフィルタリング
        if (role === 'パン祝福' || role === '水祝福') {
            filtered = filtered.filter(m => m.priesthood === '祭司' || m.priesthood === 'メルキゼデク')
        }

        // 割り当て済みメンバーの除外
        return filtered.filter(m => !assignedMemberIds.includes(m.id))
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="overflow-hidden border-border/50 shadow-sm">
                <div className="divide-y divide-border/40">
                    {assignments.map((assignment) => {
                        const availableMembers = getFilteredMembers(assignment.role)
                        const isAssigned = !!assignment.profile

                        return (
                            <div key={assignment.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                                <div className="font-medium text-foreground text-sm min-w-[5rem]">
                                    {assignment.role}
                                </div>
                                <div className="flex-1 flex justify-end">
                                    {assignment.profile ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-primary">
                                                {assignment.profile.name}
                                            </span>
                                            <button
                                                onClick={() => onRemove(assignment.id)}
                                                className="text-muted-foreground/50 hover:text-destructive transition-colors p-1"
                                                aria-label="割り当て解除"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative w-full max-w-[10rem]">
                                            <select
                                                className="block w-full appearance-none bg-transparent py-1 pr-6 text-right text-sm text-muted-foreground focus:outline-none cursor-pointer hover:text-foreground transition-colors"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        onAssign(assignment.role, e.target.value)
                                                    }
                                                }}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>未選択</option>
                                                {availableMembers.map((member) => (
                                                    <option key={member.id} value={member.id}>
                                                        {member.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-muted-foreground/50">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>
        </div>
    )
}
