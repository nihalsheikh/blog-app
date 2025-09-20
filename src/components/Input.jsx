import React, { useId } from "react";

const Input = React.forwardRef(function Input(
	{ label, type = "text", className = "", ...props },
	ref
) {
	// ref passed here is very imp
	const id = useId();

	return (
		<div className="w-full">
			{label && (
				<label
					className={`inline-block mb-1 pl-1 ${className}`}
					htmlFor={id}
				>
					{label}
				</label>
			)}

			<input
				type={type}
				className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
				ref={ref} // this will give us reference in the Parent Component, for this we used forwardRef
				{...props}
				id={id}
			/>
		</div>
	);
});

export default Input;
