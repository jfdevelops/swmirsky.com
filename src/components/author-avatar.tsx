import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AuthorAvatarProps {
  className?: string;
}

export function AuthorAvatar({ className }: AuthorAvatarProps) {
  return (
    <Avatar className={cn('size-14', className)}>
      <AvatarImage src='/public/stuart-mirsky.jpeg' />
      <AvatarFallback>
        <User className='w-8 h-8 text-amber-400' />
      </AvatarFallback>
    </Avatar>
  );
}

