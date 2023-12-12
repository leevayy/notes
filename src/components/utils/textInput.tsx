import React, { forwardRef, useRef } from "react";

type InputLikeProps = React.ComponentPropsWithRef<"input">;

const TextInputLike = forwardRef(function TextInputLike(
	props: InputLikeProps,
	ref: React.Ref<HTMLInputElement>
) {
	return (
		<div 
			{...props} ref={ref} 
			className={`${props.className} input-like`}
			contentEditable
		>
			{props.value}
		</div>
	);
});

type TextInputProps = React.ComponentPropsWithRef<"input"> & {
	setInputText: (state: string) => void;
	inputType: "input" | "input-like";
};

export function TextInput(props: TextInputProps) {
	const setInputText = props.setInputText;

	const inputRef = useRef<HTMLInputElement>(null);

	if (props.inputType === "input") {
		return (
			<input
				{...props}
				ref={inputRef}
				className={`${props.className} focusable-input`}
				onInput={() => setInputText(inputRef.current!.value)}
			/>
		);
	}
	if (props.inputType === "input-like") {
		return (
			<TextInputLike
				{...props}
				ref={inputRef}
				className={`${props.className} focusable-input`}
				onInput={() => setInputText(inputRef.current!.value)}
			/>
		);
	}

	throw Error(`Unkown TextInput inputType: ${props.inputType}`);
}
