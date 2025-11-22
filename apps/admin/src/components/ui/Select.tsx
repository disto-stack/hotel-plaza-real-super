import * as React from "react";

import { cn } from "@/lib/utils";

export interface SelectProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className, id, children, ...props }, ref) => {
		return (
			<select
				className={cn("form-input", className)}
				id={id}
				ref={ref}
				data-testid="select"
				{...props}
			>
				{children}
			</select>
		);
	},
);

Select.displayName = "Select";

export { Select };
