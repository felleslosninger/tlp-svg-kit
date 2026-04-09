import { type ReactNode, forwardRef } from 'react';

export type IconTileProps = {
	children?: ReactNode;
	name: string;
	isSelected?: boolean;
	onClick?: () => void;
};

function skipToDetails() {
	const panel = document.getElementById('icon-detail-panel');
	if (panel) {
		panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
		panel.focus();
	}
}

const IconTile = forwardRef<HTMLButtonElement, IconTileProps>(
	({ children, name, isSelected, onClick }, ref) => {
		return (
			<div className="icon-grid__item-wrapper">
				<button
					ref={ref}
					type="button"
					className="icon-grid__item ds-focus"
					aria-label={`Velg ikon ${name}`}
					aria-pressed={isSelected}
					data-color={isSelected ? 'accent' : 'neutral'}
					onClick={onClick}
				>
					{children}
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

IconTile.displayName = 'IconTile';

export default IconTile;
