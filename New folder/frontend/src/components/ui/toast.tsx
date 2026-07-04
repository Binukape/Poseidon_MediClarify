import * as React from "react";

export type ToastActionElement = React.ReactElement;

export interface ToastProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	action?: ToastActionElement;
}

const Toast = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />,
);
Toast.displayName = "Toast";

const ToastAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
	({ className, ...props }, ref) => <button ref={ref} className={className} {...props} />,
);
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
	({ className, ...props }, ref) => <button ref={ref} className={className} {...props} />,
);
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => <h4 ref={ref} className={className} {...props} />,
);
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
	({ className, ...props }, ref) => <p ref={ref} className={className} {...props} />,
);
ToastDescription.displayName = "ToastDescription";

export { Toast, ToastAction, ToastClose, ToastTitle, ToastDescription };
