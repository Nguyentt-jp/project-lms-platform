"use client"

import {
	IconDashboard,
	IconDotsVertical,
	IconLogout,
} from "@tabler/icons-react"

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import { User } from "@/lib/type"
import React from "react"
import Link from "next/link"
import { BookOpenIcon, HomeIcon, Tv2 } from "lucide-react"
import { useSignOut } from "@/hooks/use-signout"

export function NavUser({ user }: {user: User | null}) {
	const { isMobile } = useSidebar();
	const handleSignOut = useSignOut();

	if (user){
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={user.image} alt={user.name} />
									<AvatarFallback className="rounded-lg">{user.name}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="text-muted-foreground truncate text-xs">
										{user.email}
									</span>
								</div>
								<IconDotsVertical className="ml-auto" size={16} aria-hidden />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[14rem] rounded-lg"
							side={isMobile ? "bottom" : "right"}
							align="end"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage src={user.image} alt={user.name} />
										<AvatarFallback className="rounded-lg">{user.name}</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">
											{user.name ? user.name : user.email.split("@")[0]}
										</span>
										<span className="text-muted-foreground truncate text-xs">
											{user.email}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem className="flex items-center gap-2" asChild>
									<Link href="/">
										<HomeIcon size={16} aria-hidden />
										<span>Home</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem className="flex items-center gap-2" asChild>
									<Link href="/admin">
										<IconDashboard size={16} aria-hidden />
										<span>Dashboard</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem className="flex items-center gap-2" asChild>
									<Link href="/admin/course">
										<BookOpenIcon size={16} aria-hidden />
										<span>Course</span>
									</Link>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
								<IconLogout size={16} aria-hidden />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		)
	}
}
