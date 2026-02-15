import type { ReactNode } from 'react';

export type IllustrationProps = {
	children?: ReactNode;
	title: string;
	isSelected?: boolean;
	onClick?: () => void;
};

export default function Illustration({
	children,
	title,
	isSelected,
	onClick,
}: IllustrationProps) {
	return (
		<button
			type="button"
			className={`svg-grid__item ds-focus ${isSelected ? 'svg-grid__item--selected' : ''}`}
			aria-label={`Select ${title}`}
			onClick={onClick}
		>
			{children}
			<span>{title}</span>
		</button>
	);
}
