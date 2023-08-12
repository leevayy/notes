import React, { forwardRef, useEffect, useRef } from "react";

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

type FocusableInputProps = React.ComponentPropsWithRef<"input"> & {
	setFocus: (state: boolean) => void;
	setInputText: (state: string) => void;
	inputType: "input" | "input-like";
};

export function FocusableTextInput(props: FocusableInputProps) {
	const setFocus = props.setFocus;
	const setInputText = props.setInputText;

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current === null) {
			throw Error(`FocusableInput inputRef.current is null`);
		}

		if (
			document.hasFocus() &&
			inputRef.current.contains(document.activeElement)
		) {
			setFocus(true);
		}
	}, []);

	if (props.inputType === "input") {
		return (
			<input
				{...props}
				ref={inputRef}
				className={`${props.className} focusable-input`}
				onInput={() => setInputText(inputRef.current!.value)}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
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
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
			/>
		);
	}

	throw Error(`Unkown FocusableInput inputType: ${props.inputType}`);
}
