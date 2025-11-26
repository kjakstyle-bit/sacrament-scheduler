'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAssignments(startDate: Date, endDate: Date) {
    const assignments = await prisma.assignment.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            profile: true,
        },
    })

    return assignments.map(a => ({
        id: a.id,
        role: a.role,
        date: a.date,
        profile: a.profile ? { id: a.profile.id, name: a.profile.name } : null
    }))
}

export async function assignRole(date: Date, role: string, profileId: string) {
    try {
        await prisma.assignment.create({
            data: {
                date,
                role,
                profileId,
            },
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to assign role:', error)
        return { success: false, error }
    }
}

export async function removeAssignment(id: string) {
    try {
        await prisma.assignment.delete({
            where: { id },
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to remove assignment:', error)
        return { success: false, error }
    }
}
