import {
  BikeIcon,
  LogOutIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authApi, useLogoutMutation, useUseInfoQuery } from "@/redux/features/auth.api"
import { useAppDispatch } from "@/redux/hook"
import { Role } from "./constant.ts/role"
import { Link } from "react-router"

export default function UserMenu() {

  const { data } = useUseInfoQuery(undefined)
  const [logout] = useLogoutMutation()
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    await logout(undefined)
    dispatch(authApi.util.resetApiState());
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent cursor-pointer">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Profile image" />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {data?.data?.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {data?.data?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            You are a <span className="capitalize text-primary"> {data?.data?.role}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {data?.data?.role === Role.RIDER &&
          <div>
            <Link to={"/take-ride"}>
              <DropdownMenuItem className="cursor-pointer">
                <BikeIcon size={16} className="opacity-60" aria-hidden="true" />
                <span>Take a Ride</span>
              </DropdownMenuItem>
            </Link>
            <Link to={"/ride-history"}>
              <DropdownMenuItem className="cursor-pointer">
                <BikeIcon size={16} className="opacity-60" aria-hidden="true" />
                <span>Ride History</span>
              </DropdownMenuItem>
            </Link>
          </div>
        }
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button onClick={handleLogout} variant="outline" className="cursor-pointer hover:bg-muted">
            <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
