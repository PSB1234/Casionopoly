import { cva, type VariantProps } from "class-variance-authority";
import {
	Dialog as ShadcnDialog,
	DialogClose as ShadcnDialogClose,
	DialogContent as ShadcnDialogContent,
	DialogDescription as ShadcnDialogDescription,
	DialogFooter as ShadcnDialogFooter,
	DialogHeader as ShadcnDialogHeader,
	DialogTitle as ShadcnDialogTitle,
	DialogTrigger as ShadcnDialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import "./styles/retro.css";

const Dialog = ShadcnDialog;

const DialogTrigger = ShadcnDialogTrigger;

const DialogHeader = ShadcnDialogHeader;

const DialogDescription = ShadcnDialogDescription;

const DialogClose = ShadcnDialogClose;

const DialogFooter = ShadcnDialogFooter;

export interface BitDialogProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof dialogContentVariants> {}

export interface BitDialogContentProps
	extends React.ComponentProps<typeof ShadcnDialogContent>,
		VariantProps<typeof dialogContentVariants> {
	showCloseButton?: boolean;
}

function DialogTitle({ ...props }: BitDialogProps) {
	const { className, font } = props;
	return (
		<ShadcnDialogTitle
			className={cn(font !== "normal" && "retro", className)}
			{...props}
		/>
	);
}

export const dialogContentVariants = cva("", {
	variants: {
		font: {
			normal: "",
			retro: "retro",
		},
	},
	defaultVariants: {
		font: "retro",
	},
});

function DialogContent({
	className,
	children,
	font,
	showCloseButton,
	...props
}: BitDialogContentProps) {
	return (
		<ShadcnDialogContent
			className={cn(
				"rounded-none border-none bg-card",
				font !== "normal" && "retro",
				className,
			)}
			showCloseButton={showCloseButton}
			{...props}
		>
			{children}

			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -mx-1.5 border-foreground border-x-6 dark:border-ring"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -my-1.5 border-foreground border-y-6 dark:border-ring"
			/>
		</ShadcnDialogContent>
	);
}

export {
	Dialog,
	DialogTrigger,
	DialogHeader,
	DialogFooter,
	DialogDescription,
	DialogTitle,
	DialogContent,
	DialogClose,
};
