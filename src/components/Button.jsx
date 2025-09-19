// Common button component across app
import React from "react";

function Button({
	children,
	type = "button",
	bgColor = "bg-blue-600",
	textColor = "text-white",
	className = "",
	...props
}) {
	// whatever text is passed while naming a button, it will be in children prop
	return (
		<button
			className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`}
			{...props}
		>
			{children}
		</button>
	)
}

export default Button;
