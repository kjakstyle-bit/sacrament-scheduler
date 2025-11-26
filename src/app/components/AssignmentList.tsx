import { Member } from "@/app/members/types"
import { X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
            <div className="grid grid-cols-2 gap-4">
                {assignments.map((assignment) => {
                    const availableMembers = getFilteredMembers(assignment.role)

                    return (
                        <Card key={assignment.id} className="overflow-hidden">
                            <CardHeader className="p-3 pb-2 bg-gray-50/50">
                                <CardTitle className="text-sm font-medium text-gray-700 text-center">
                                    {assignment.role}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-2">
                                <div className="flex items-center justify-center min-h-[3rem]">
                                    {assignment.profile ? (
                                        <div className="flex flex-col items-center gap-1 w-full">
                                            <div className="relative w-full text-center bg-blue-50/50 rounded-md py-1.5 border border-blue-100">
                                                <span className="text-gray-900 font-medium text-sm block truncate px-2">
                                                    {assignment.profile.name}
                                                </span>
                                                <button
                                                    onClick={() => onRemove(assignment.id)}
                                                    className="absolute -top-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-sm border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <select
                                            className="block w-full rounded-md border-gray-300 py-1.5 text-gray-900 text-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6"
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
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
