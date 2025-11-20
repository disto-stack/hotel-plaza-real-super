import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface FormFieldProps {
	label: string;
	htmlFor?: string;
	error?: string;
	required?: boolean;
	children: React.ReactNode;
	className?: string;
}

export function FormField({
	label,
	htmlFor,
	error,
	required = false,
	children,
	className,
}: FormFieldProps) {
	const id = htmlFor || `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<Label htmlFor={id}>
				{label}
				{required && <span className="text-destructive ml-1">*</span>}
			</Label>
			{React.isValidElement(children)
				? React.cloneElement(
						children as React.ReactElement,
						{
							...(children.props as React.HTMLAttributes<HTMLElement>),
							id,
							"aria-invalid": error ? "true" : undefined,
							"aria-describedby": error ? `${id}-error` : undefined,
						} as React.HTMLAttributes<HTMLElement>,
					)
				: children}
			{error && (
				<p
					id={`${id}-error`}
					className="text-sm text-destructive font-sans"
					role="alert"
				>
					{error}
				</p>
			)}
		</div>
	);
}
