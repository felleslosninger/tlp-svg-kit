import { Button, Card, Heading } from '@digdir/designsystemet-react';
import { useRef, useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { renderToString } from 'react-dom/server';

// Color mappings for light and dark modes
const lightModeColors: Record<string, string> = {
	'var(--tlp-svg-color-1)': '#ffffff',
	'var(--tlp-svg-color-2)': '#1e2b3c',
	'var(--tlp-svg-color-3)': '#edcfc5',
	'var(--tlp-svg-color-4)': '#f45f63',
	'var(--tlp-svg-color-5)': '#e5aa20',
	'var(--tlp-svg-color-6)': '#1e98f5',
};

const darkModeColors: Record<string, string> = {
	'var(--tlp-svg-color-1)': '#ffffff',
	'var(--tlp-svg-color-2)': '#384a5e',
	'var(--tlp-svg-color-3)': '#f9e8e8',
	'var(--tlp-svg-color-4)': '#f45f63',
	'var(--tlp-svg-color-5)': '#e5aa20',
	'var(--tlp-svg-color-6)': '#1e98f5',
};

function replaceColorsInSvg(
	svgString: string,
	colorMap: Record<string, string>,
): string {
	let result = svgString;
	for (const [cssVar, hex] of Object.entries(colorMap)) {
		result = result.split(cssVar).join(hex);
	}
	return result;
}

export type DetailPanelProps = {
	title: string;
	Svg: ComponentType<SVGProps<SVGSVGElement>>;
	onClose: () => void;
	triggerRef?: React.RefObject<HTMLButtonElement | null>;
};

export default function DetailPanel({
	title,
	Svg,
	onClose,
	triggerRef,
}: DetailPanelProps) {
	const [copied, setCopied] = useState<string | null>(null);
	const [announcement, setAnnouncement] = useState('');
	const panelRef = useRef<HTMLElement>(null);

	const handleClose = () => {
		onClose();
		setTimeout(() => {
			triggerRef?.current?.focus();
		}, 0);
	};

	const svgString = renderToString(<Svg />);
	const lightModeSvg = replaceColorsInSvg(svgString, lightModeColors);
	const darkModeSvg = replaceColorsInSvg(svgString, darkModeColors);

	const reactImportCode = `import { ${title} } from '@digdir/illustration-lib/react';`;

	const handleCopy = async (text: string, label: string) => {
		await navigator.clipboard.writeText(text);
		setCopied(label);
		setAnnouncement(
			`${label === 'react' ? 'React import' : `${label} mode SVG`} kopiert til utklippstavlen`,
		);
		setTimeout(() => {
			setCopied(null);
			setAnnouncement('');
		}, 2000);
	};

	return (
		<aside
			className="detail-panel"
			id="detail-panel"
			tabIndex={-1}
			ref={panelRef}
		>
			<div className="ds-sr-only" aria-live="polite" aria-atomic="true">
				{announcement}
			</div>
			<div className="detail-panel__header">
				<Heading level={2} data-size="sm">
					{title}
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

			<div className="detail-panel__content">
				<div className="detail-panel__previews" data-color="neutral">
					<Card className="detail-panel__preview" data-color-scheme="light">
						<span className="detail-panel__preview-label">Light</span>
						<div
							className="detail-panel__preview-svg"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
							dangerouslySetInnerHTML={{ __html: lightModeSvg }}
						/>
						<Button
							variant="secondary"
							data-size="sm"
							onClick={() => handleCopy(lightModeSvg, 'light')}
						>
							{copied === 'light' ? 'Copied!' : 'Copy SVG'}
						</Button>
					</Card>
					<Card className="detail-panel__preview" data-color-scheme="dark">
						<span className="detail-panel__preview-label">Dark</span>
						<div
							className="detail-panel__preview-svg"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
							dangerouslySetInnerHTML={{ __html: darkModeSvg }}
						/>
						<Button
							variant="secondary"
							data-size="sm"
							onClick={() => handleCopy(darkModeSvg, 'dark')}
						>
							{copied === 'dark' ? 'Copied!' : 'Copy SVG'}
						</Button>
					</Card>
				</div>

				<div className="detail-panel__code">
					<Heading level={3} data-size="xs">
						React Import
					</Heading>
					<div className="detail-panel__code-row">
						<pre>{reactImportCode}</pre>
						<Button
							variant="tertiary"
							data-size="sm"
							onClick={() => handleCopy(reactImportCode, 'react')}
						>
							{copied === 'react' ? 'Copied!' : 'Copy'}
						</Button>
					</div>
				</div>
			</div>
		</aside>
	);
}
