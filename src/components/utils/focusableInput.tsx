import {
	useEffect, 
	useRef
 } from "react";

type FocusableInputProps = React.ComponentPropsWithRef<"input"> & {
	setFocus: (state: boolean) => void;
	setInputText: (state: string) => void;
}

export function FocusableInput(props: FocusableInputProps) {
	const setFocus = props.setFocus;
	const setInputText = props.setInputText;
 
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current === null) {
			throw Error(`FocusableInput inputRef.current is null`)
		}

		if (
			document.hasFocus() && inputRef.current.contains(document.activeElement)
		) {
			setFocus(true);
		}
	}, []);

	return (
		<input
			{...props}
			ref={inputRef}
			className={`${props.className} focusable-input`}
			onInput={ () => setInputText(inputRef.current!.value) }
			onFocus={() => setFocus(true)}
			onBlur={() => setFocus(false)}
		/>
	);
}