import { createClient } from '@/lib/supabase/server'
import { ScheduleView } from './components/ScheduleView'
import { prisma } from '@/lib/prisma'

import { Profile } from '@prisma/client'
import { Member } from './members/types'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Page() {
  console.log('Page component rendering...')
  let user = null
  let profile = null
  let members: Member[] = []

  try {
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
    console.log('User fetched:', user?.email)

    if (user) {
      profile = await prisma.profile.findUnique({
        where: { id: user.id },
      })
      console.log('Profile fetched:', profile?.name)
    }

    // Fetch all members for assignment
    const profiles = await prisma.profile.findMany({
      orderBy: { name: 'asc' },
    })
    members = profiles.map((p: any) => ({
      id: p.id,
      name: p.name,
      priesthood: (p.priesthood as Member['priesthood']) || '執事',
    }))

  } catch (error) {
    console.error('Error fetching data:', error)
  }

  return <ScheduleView user={user} profile={profile} members={members} />
}