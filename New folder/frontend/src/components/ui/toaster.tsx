import { useToast } from "@/hooks/use-toast";

function Toaster() {
	const { toasts } = useToast();

	if (toasts.length === 0) {
		return null;
	}

	return (
		<div className="fixed bottom-4 right-4 z-50 space-y-2">
			{toasts.map((toast) => (
				<div key={toast.id} className="rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
					{toast.title && <div className="font-medium">{toast.title}</div>}
					{toast.description && <div className="text-muted-foreground">{toast.description}</div>}
				</div>
			))}
		</div>
	);
}

export { Toaster };
