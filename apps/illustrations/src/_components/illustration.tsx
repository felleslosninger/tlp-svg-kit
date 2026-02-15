import { type ReactNode, forwardRef } from 'react';

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

const Illustration = forwardRef<HTMLButtonElement, IllustrationProps>(
	({ children, title, isSelected, onClick }, ref) => {
		return (
			<div className="svg-grid__item-wrapper">
				<button
					ref={ref}
					type="button"
					className="svg-grid__item ds-focus"
					aria-label={`Velg ${title}`}
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
						Hopp til detaljer
					</button>
				)}
			</div>
		);
	},
);

Illustration.displayName = 'Illustration';

export default Illustration;
