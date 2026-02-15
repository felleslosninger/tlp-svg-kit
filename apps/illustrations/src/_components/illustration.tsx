import type { ReactNode } from 'react';

export type IllustrationProps = {
	children?: ReactNode;
	title: string;
	isSelected?: boolean;
	onClick?: () => void;
};

function skipToDetails() {
	const panel = document.getElementById('detail-panel');
	if (panel) {
		panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
		panel.focus();
	}
}

export default function Illustration({
	children,
	title,
	isSelected,
	onClick,
}: IllustrationProps) {
	return (
		<div className="svg-grid__item-wrapper">
			<button
				type="button"
				className="svg-grid__item ds-focus"
				aria-label={`Select ${title}`}
				aria-pressed={isSelected}
				data-color={isSelected ? 'accent' : 'neutral'}
				onClick={onClick}
			>
				{children}
				<span>{title}</span>
			</button>
			{isSelected && (
				<button
					type="button"
					className="skip-to-panel"
					data-color="neutral"
					onClick={skipToDetails}
				>
					Skip to details
				</button>
			)}
		</div>
	);
}
