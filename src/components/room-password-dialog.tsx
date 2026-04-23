"use client";

import { useState } from "react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/8bit/alert-dialog";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";

interface RoomPasswordDialogProps {
	open: boolean;
	error: string | null;
	onClose: () => void;
	onSubmit: (password: string) => void;
}

export function RoomPasswordDialog({
	open,
	error,
	onClose,
	onSubmit,
}: RoomPasswordDialogProps) {
	const [value, setValue] = useState("");

	function handleSubmit() {
		if (value.trim()) {
			onSubmit(value.trim());
		}
	}

	function handleClose() {
		setValue("");
		onClose();
	}

	return (
		<AlertDialog
			onOpenChange={(isOpen) => !isOpen && handleClose()}
			open={open}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Private Room</AlertDialogTitle>
					<AlertDialogDescription>
						Enter the password to join this room.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="flex flex-col gap-2 py-2">
					<Input
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
						placeholder="Password"
						type="password"
						value={value}
					/>
					{error && <p className="text-destructive text-sm">{error}</p>}
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
					<Button disabled={!value.trim()} onClick={handleSubmit}>
						Join
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
