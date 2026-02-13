import { Button, Dialog, Heading, Tabs } from '@digdir/designsystemet-react';
import { type ReactNode, useId, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';

export type IllustrationProps = {
	children?: ReactNode;
	title: string;
};

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
	'var(--tlp-svg-color-1)': '#828282',
	'var(--tlp-svg-color-2)': '#6d7885',
	'var(--tlp-svg-color-3)': '#edcfc5',
	'var(--tlp-svg-color-4)': '#7a292c',
	'var(--tlp-svg-color-5)': '#c6a862',
	'var(--tlp-svg-color-6)': '#1e5b89',
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

function toCamelCase(str: string): string {
	return str.charAt(0).toLowerCase() + str.slice(1);
}

export default function Illustration({ children, title }: IllustrationProps) {
	const id = useId();
	const modalRef = useRef<HTMLDialogElement>(null);
	const [copied, setCopied] = useState<string | null>(null);

	const handleOpenModal = () => {
		if (modalRef.current) {
			modalRef.current.showModal();
		}
	};

	const svgString = renderToString(children);
	const lightModeSvg = replaceColorsInSvg(svgString, lightModeColors);
	const darkModeSvg = replaceColorsInSvg(svgString, darkModeColors);

	const reactImportCode = `import '@digdir/illustration-lib/styles.css';
import { ${title} } from '@digdir/illustration-lib/react';

// Usage
<${title} />`;

	const svgImportCode = `import '@digdir/illustration-lib/styles.css';
import { ${toCamelCase(title)} } from '@digdir/illustration-lib/svg';

// Usage (vanilla JS)
element.innerHTML = ${toCamelCase(title)};`;

	const handleCopy = async (text: string, label: string) => {
		await navigator.clipboard.writeText(text);
		setCopied(label);
		setTimeout(() => setCopied(null), 2000);
	};

	return (
		<>
			<button
				className="svg-grid__item ds-focus"
				aria-label={'Åpne modal for ' + title}
				onClick={handleOpenModal}
			>
				{children}
				<span>{title}</span>
			</button>
			<Dialog
				title={title}
				closedby="any"
				ref={modalRef}
				className="svg-grid__modal"
				data-color-scheme="dark"
			>
				<Dialog.Block>
					<Heading>{title}</Heading>
				</Dialog.Block>
				<Dialog.Block>
					<div className="svg-grid__modal--info">
						<div className="svg-grid__modal--info--boxes">
							<Tabs defaultValue="usage">
								<Tabs.List>
									<Tabs.Tab value="usage">Usage</Tabs.Tab>
									<Tabs.Tab value="light">Light Mode SVG</Tabs.Tab>
									<Tabs.Tab value="dark">Dark Mode SVG</Tabs.Tab>
								</Tabs.List>
								<Tabs.Panel value="usage">
									<div className="svg-grid__modal--usage">
										<div className="svg-grid__modal--code-block">
											<div className="svg-grid__modal--code-header">
												<Heading level={4} data-size="xs">
													React
												</Heading>
												<Button
													variant="tertiary"
													data-size="sm"
													onClick={() => handleCopy(reactImportCode, 'react')}
												>
													{copied === 'react' ? 'Copied!' : 'Copy'}
												</Button>
											</div>
											<pre>{reactImportCode}</pre>
										</div>
										<div className="svg-grid__modal--code-block">
											<div className="svg-grid__modal--code-header">
												<Heading level={4} data-size="xs">
													Any Framework (SVG string)
												</Heading>
												<Button
													variant="tertiary"
													data-size="sm"
													onClick={() => handleCopy(svgImportCode, 'svg')}
												>
													{copied === 'svg' ? 'Copied!' : 'Copy'}
												</Button>
											</div>
											<pre>{svgImportCode}</pre>
										</div>
										<p className="svg-grid__modal--note">
											The CSS file sets up CSS variables for light/dark mode.
											Use <code>data-color-scheme="dark"</code> on a parent
											element to switch themes.
										</p>
									</div>
								</Tabs.Panel>
								<Tabs.Panel value="light">
									<div className="svg-grid__modal--code-block">
										<div className="svg-grid__modal--code-header">
											<Heading level={4} data-size="xs">
												Light Mode SVG (with hex colors)
											</Heading>
											<Button
												variant="tertiary"
												data-size="sm"
												onClick={() => handleCopy(lightModeSvg, 'light')}
											>
												{copied === 'light' ? 'Copied!' : 'Copy SVG'}
											</Button>
										</div>
										<pre className="svg-grid__modal--svg-code">
											{lightModeSvg}
										</pre>
									</div>
								</Tabs.Panel>
								<Tabs.Panel value="dark">
									<div className="svg-grid__modal--code-block">
										<div className="svg-grid__modal--code-header">
											<Heading level={4} data-size="xs">
												Dark Mode SVG (with hex colors)
											</Heading>
											<Button
												variant="tertiary"
												data-size="sm"
												onClick={() => handleCopy(darkModeSvg, 'dark')}
											>
												{copied === 'dark' ? 'Copied!' : 'Copy SVG'}
											</Button>
										</div>
										<pre className="svg-grid__modal--svg-code">
											{darkModeSvg}
										</pre>
									</div>
								</Tabs.Panel>
							</Tabs>
						</div>
						<div className="svg-grid__modal--info--illustration" id={id}>
							{children}
						</div>
					</div>
				</Dialog.Block>
			</Dialog>
		</>
	);
}
