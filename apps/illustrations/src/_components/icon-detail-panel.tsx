import { Button, Card, Heading, List } from '@digdir/designsystemet-react';
import { useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { renderToString } from 'react-dom/server';

export type IconDetailPanelProps = {
	name: string;
	Icon: ComponentType<SVGProps<SVGSVGElement>>;
	onClose: () => void;
	triggerRef?: React.RefObject<HTMLButtonElement | null>;
};

export default function IconDetailPanel({
	name,
	Icon,
	onClose,
	triggerRef,
}: IconDetailPanelProps) {
	const [copied, setCopied] = useState<string | null>(null);
	const [announcement, setAnnouncement] = useState('');

	const handleClose = () => {
		onClose();
		setTimeout(() => {
			triggerRef?.current?.focus();
		}, 0);
	};

	const svgString = renderToString(<Icon />);
	const reactImportCode = `import { ${name} } from '@digdir/illustration-lib/icons/react';`;
	const svgImportCode = `import { ${name
		.charAt(0)
		.toLowerCase()}${name.slice(1).replace(/Icon$/, '')} } from '@digdir/illustration-lib/icons/svg';`;
	const usageCode = `<${name} aria-hidden />`;

	const handleCopy = async (text: string, label: string) => {
		await navigator.clipboard.writeText(text);
		setCopied(label);
		setAnnouncement(`${label} kopiert til utklippstavlen`);
		setTimeout(() => {
			setCopied(null);
			setAnnouncement('');
		}, 1800);
	};

	return (
		<aside className="icon-detail-panel" id="icon-detail-panel" tabIndex={-1}>
			<div className="ds-sr-only" aria-live="polite" aria-atomic="true">
				{announcement}
			</div>
			<div className="icon-detail-panel__header">
				<Heading level={2} data-size="sm">
					{name}
				</Heading>
				<Button
					variant="tertiary"
					data-size="sm"
					onClick={handleClose}
					aria-label="Lukk panel"
				>
					<span aria-hidden="true">✕</span>
				</Button>
			</div>

			<div className="icon-detail-panel__content">
				<Card className="icon-detail-panel__preview" data-color="neutral">
					<div
						className="icon-detail-panel__preview-cell"
						data-color-scheme="light"
					>
						<Icon />
					</div>
					<Button
						variant="tertiary"
						data-size="sm"
						onClick={() => handleCopy(svgString, 'Raw SVG')}
					>
						{copied === 'Raw SVG' ? 'Kopiert!' : 'Kopier'}
					</Button>
				</Card>

				<Card className="icon-detail-panel__meta" data-color="neutral">
					<Heading level={3} data-size="2xs">
						Regler
					</Heading>
					<List.Unordered data-size="sm">
						<List.Item>Ikkje bruk i brødtekst</List.Item>
						<List.Item>Ikkje bruk i brødtekst</List.Item>
						<List.Item>Ikkje bruk i brødtekst</List.Item>
					</List.Unordered>
				</Card>

				<div className="icon-detail-panel__code">
					<Heading level={3} data-size="2xs">
						React import
					</Heading>
					<div className="icon-detail-panel__code-row">
						<pre>{reactImportCode}</pre>
						<Button
							variant="tertiary"
							data-size="sm"
							onClick={() => handleCopy(reactImportCode, 'React import')}
						>
							{copied === 'React import' ? 'Kopiert!' : 'Kopier'}
						</Button>
					</div>
				</div>

				<div className="icon-detail-panel__code">
					<Heading level={3} data-size="2xs">
						SVG import
					</Heading>
					<div className="icon-detail-panel__code-row">
						<pre>{svgImportCode}</pre>
						<Button
							variant="tertiary"
							data-size="sm"
							onClick={() => handleCopy(svgImportCode, 'SVG import')}
						>
							{copied === 'SVG import' ? 'Kopiert!' : 'Kopier'}
						</Button>
					</div>
				</div>

				<div className="icon-detail-panel__code">
					<Heading level={3} data-size="2xs">
						Component usage
					</Heading>
					<div className="icon-detail-panel__code-row">
						<pre>{usageCode}</pre>
						<Button
							variant="tertiary"
							data-size="sm"
							onClick={() => handleCopy(usageCode, 'Usage snippet')}
						>
							{copied === 'Usage snippet' ? 'Kopiert!' : 'Kopier'}
						</Button>
					</div>
				</div>
			</div>
		</aside>
	);
}
