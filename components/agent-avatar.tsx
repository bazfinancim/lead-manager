import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials, getAvatarColor } from '@/lib/avatar-utils'
import { cn } from '@/lib/utils'

interface AgentAvatarProps {
  name: string
  className?: string
  showName?: boolean
}

export function AgentAvatar({ name, className, showName = false }: AgentAvatarProps) {
  const initials = getInitials(name)
  const colorClass = getAvatarColor(name)

  return (
    <div className="flex items-center gap-2">
      <Avatar className={cn('h-8 w-8', className)}>
        <AvatarFallback className={cn(colorClass, 'text-white font-semibold text-xs')}>
          {initials}
        </AvatarFallback>
      </Avatar>
      {showName && <span>{name}</span>}
    </div>
  )
}
