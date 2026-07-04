import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarState = "expanded" | "collapsed";

type SidebarContextValue = {
	state: SidebarState;
	toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
	const context = useContext(SidebarContext);

	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}

	return context;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<SidebarState>("expanded");

	const value = useMemo(
		() => ({
			state,
			toggle: () => setState((current) => (current === "expanded" ? "collapsed" : "expanded")),
		}),
		[state],
	);

	return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function Sidebar({ children, className }: { children: ReactNode; className?: string; collapsible?: "icon" | "offcanvas" | "none" }) {
	const { state } = useSidebar();
	const collapsed = state === "collapsed";

	return (
		<aside
			className={cn(
				"sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200",
				collapsed ? "w-16" : "w-72",
				className,
			)}
		>
			{children}
		</aside>
	);
}

export function SidebarTrigger({ className }: { className?: string }) {
	const { toggle } = useSidebar();

	return (
		<button
			type="button"
			onClick={toggle}
			className={cn(
				"inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted transition-colors",
				className,
			)}
			aria-label="Toggle sidebar"
		>
			<Menu className="h-4 w-4" />
		</button>
	);
}

export function SidebarContent({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("flex-1 overflow-auto", className)}>{children}</div>;
}

export function SidebarGroup({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("space-y-2", className)}>{children}</div>;
}

export function SidebarGroupContent({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("space-y-1", className)}>{children}</div>;
}

export function SidebarGroupLabel({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("px-3 text-xs font-medium text-muted-foreground", className)}>{children}</div>;
}

export function SidebarMenu({ children, className }: { children: ReactNode; className?: string }) {
	return <ul className={cn("space-y-1 px-2", className)}>{children}</ul>;
}

export function SidebarMenuItem({ children, className }: { children: ReactNode; className?: string }) {
	return <li className={cn(className)}>{children}</li>;
}

export function SidebarMenuButton({
	children,
	className,
	asChild,
	tooltip,
}: {
	children: ReactNode;
	className?: string;
	asChild?: boolean;
	tooltip?: string;
}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp className={className} title={tooltip} type={asChild ? undefined : "button"}>
			{children}
		</Comp>
	);
}

export function SidebarFooter({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("shrink-0", className)}>{children}</div>;
}
