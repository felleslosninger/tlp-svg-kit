import { Button, Card, Heading } from '@digdir/designsystemet-react';
import { useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { renderToString } from 'react-dom/server';

export type IconDetailPanelProps = {
	name: string;
	Icon: ComponentType<SVGProps<SVGSVGElement>>;
	onClose: () => void;
	triggerRef?: React.RefObject<HTMLButtonElement | null>;
};

function getSvgStats(svgString: string) {
	const pathCount = (svgString.match(/<path\b/gi) || []).length;
	const strokeCount = (svgString.match(/stroke=/gi) || []).length;
	const viewBoxMatch = svgString.match(/viewBox=\"([^\"]+)\"/i);

	return {
		pathCount,
		strokeCount,
		viewBox: viewBoxMatch?.[1] ?? 'N/A',
	};
}

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
	const stats = getSvgStats(svgString);

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
					<span className="icon-detail-panel__preview-label">Live preview</span>
					<div className="icon-detail-panel__preview-grid">
						<div className="icon-detail-panel__preview-cell">
							<span>Neutral</span>
							<div style={{ color: 'var(--ds-color-neutral-text-default)' }}>
								<Icon />
							</div>
						</div>
						<div className="icon-detail-panel__preview-cell">
							<span>Accent</span>
							<div style={{ color: 'var(--ds-color-accent-text-default)' }}>
								<Icon />
							</div>
						</div>
						<div className="icon-detail-panel__preview-cell">
							<span>Inverted</span>
							<div className="icon-detail-panel__inverted-preview">
								<Icon />
							</div>
						</div>
					</div>
				</Card>

				<Card className="icon-detail-panel__meta" data-color="neutral">
					<Heading level={3} data-size="2xs">
						Metadata
					</Heading>
					<ul>
						<li>ViewBox: {stats.viewBox}</li>
						<li>Path elements: {stats.pathCount}</li>
						<li>Stroke attributes: {stats.strokeCount}</li>
						<li>Color mode: currentColor</li>
					</ul>
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
							{copied === 'React import' ? 'Copied!' : 'Copy'}
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
							{copied === 'SVG import' ? 'Copied!' : 'Copy'}
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
							{copied === 'Usage snippet' ? 'Copied!' : 'Copy'}
						</Button>
					</div>
				</div>

				<div className="icon-detail-panel__code">
					<Heading level={3} data-size="2xs">
						Raw SVG
					</Heading>
					<div className="icon-detail-panel__code-row">
						<pre>{svgString}</pre>
						<Button
							variant="tertiary"
							data-size="sm"
							onClick={() => handleCopy(svgString, 'Raw SVG')}
						>
							{copied === 'Raw SVG' ? 'Copied!' : 'Copy'}
						</Button>
					</div>
				</div>
			</div>
		</aside>
	);
}
