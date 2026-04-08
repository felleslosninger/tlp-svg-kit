import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from '@svgr/core';
import { optimize } from 'svgo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgDir = path.resolve(__dirname, '../svgs');
const iconDir = path.resolve(__dirname, '../icons');
const reactOutputDir = path.resolve(__dirname, './react');
const svgOutputDir = path.resolve(__dirname, './svg');
const iconReactOutputDir = path.resolve(__dirname, './icon-react');
const iconSvgOutputDir = path.resolve(__dirname, './icon-svg');

fs.mkdirSync(reactOutputDir, { recursive: true });
fs.mkdirSync(svgOutputDir, { recursive: true });
fs.mkdirSync(iconReactOutputDir, { recursive: true });
fs.mkdirSync(iconSvgOutputDir, { recursive: true });

const colorReplacements: Record<string, string> = {
	white: 'var(--tlp-svg-color-1)',
	'#fff': 'var(--tlp-svg-color-1)',
	'#FFF': 'var(--tlp-svg-color-1)',
	'#FFFFFF': 'var(--tlp-svg-color-1)',
	'#ffffff': 'var(--tlp-svg-color-1)',
	'#1E2B3C': 'var(--tlp-svg-color-2)',
	'#1e2b3c': 'var(--tlp-svg-color-2)',
	'#EDCFC5': 'var(--tlp-svg-color-3)',
	'#edcfc5': 'var(--tlp-svg-color-3)',
	'#F45F63': 'var(--tlp-svg-color-4)',
	'#f45f63': 'var(--tlp-svg-color-4)',
	'#E5AA20': 'var(--tlp-svg-color-5)',
	'#e5aa20': 'var(--tlp-svg-color-5)',
	'#1E98F5': 'var(--tlp-svg-color-6)',
	'#1e98f5': 'var(--tlp-svg-color-6)',
};

function toPascalCase(str: string): string {
	return str
		.replace(/-./g, (match) => match.charAt(1).toUpperCase())
		.replace(/^\w/, (c) => c.toUpperCase());
}

function toCamelCase(str: string): string {
	return str.replace(/-./g, (match) => match.charAt(1).toUpperCase());
}

function replaceColorsInSvg(svgCode: string): string {
	let result = svgCode;
	for (const [color, cssVar] of Object.entries(colorReplacements)) {
		// Replace fill="color" and stroke="color" attributes
		const regex = new RegExp(`(fill|stroke)=["']${color}["']`, 'gi');
		result = result.replace(regex, `$1="${cssVar}"`);
	}
	return result;
}

function replaceIconColorsWithCurrentColor(svgCode: string): string {
	return svgCode.replace(
		/(fill|stroke)=("|')(.*?)(\2)/gi,
		(match, attr: string, quote: string, value: string) => {
			const trimmedValue = value.trim();

			if (
				trimmedValue === 'none' ||
				trimmedValue === 'currentColor' ||
				trimmedValue === 'inherit' ||
				trimmedValue.startsWith('url(') ||
				trimmedValue.startsWith('var(')
			) {
				return match;
			}

			return `${attr}=${quote}currentColor${quote}`;
		},
	);
}

function processSvg(svgCode: string): string {
	const optimized = optimize(svgCode, {
		plugins: [
			{
				name: 'convertColors',
				params: {
					currentColor: false,
					names2hex: true,
					rgb2hex: true,
					shorthex: false,
					shortname: true,
				},
			},
			// Remove width/height for responsive SVGs
			{
				name: 'removeAttrs',
				params: { attrs: ['width', 'height'] },
			},
		],
	});
	return replaceColorsInSvg(optimized.data);
}

function processIconSvg(svgCode: string): string {
	const normalizedColors = replaceIconColorsWithCurrentColor(svgCode);
	const optimized = optimize(normalizedColors, {
		plugins: [
			'preset-default',
			{
				name: 'removeAttrs',
				params: { attrs: ['width', 'height'] },
			},
		],
	});

	return optimized.data;
}

function ensureSvgAttribute(
	svgCode: string,
	attributeName: string,
	attributeValue: string,
): string {
	if (new RegExp(`\\s${attributeName}=`).test(svgCode)) {
		return svgCode;
	}

	return svgCode.replace(
		/<svg\b([^>]*)>/i,
		`<svg$1 ${attributeName}="${attributeValue}">`,
	);
}

function assertSinglePathIcon(svgCode: string, fileName: string): void {
	const pathCount = (svgCode.match(/<path\b/gi) || []).length;
	const otherShapes = svgCode.match(
		/<(rect|circle|ellipse|line|polyline|polygon)\b/gi,
	);

	if (otherShapes && otherShapes.length > 0) {
		throw new Error(
			`Icon ${fileName} is invalid: only a single <path> is allowed. Found unsupported shape elements: ${[...new Set(otherShapes.map((shape) => shape.toLowerCase()))].join(', ')}`,
		);
	}

	if (pathCount !== 1) {
		throw new Error(
			`Icon ${fileName} is invalid: expected exactly 1 <path>, found ${pathCount}.`,
		);
	}
}

async function buildIllustrations() {
	const files = fs
		.readdirSync(svgDir)
		.filter((f: string) => f.endsWith('.svg'));

	let reactIndexContent = '';
	let svgIndexContent =
		'// Framework-agnostic SVG strings with CSS variable theming\n';
	svgIndexContent +=
		'// Import the CSS: @digdir/illustration-lib/styles.css\n\n';

	for (const file of files) {
		const svgPath = path.join(svgDir, file);
		const svgCode = fs.readFileSync(svgPath, 'utf8');
		const baseName = path.basename(file, '.svg');
		const pascalName = toPascalCase(baseName);
		const camelName = toCamelCase(baseName);

		try {
			const processedSvg = processSvg(svgCode);
			const svgOutputPath = path.join(svgOutputDir, `${pascalName}.svg`);
			fs.writeFileSync(svgOutputPath, processedSvg);
			console.log(`Created SVG: ${svgOutputPath}`);

			svgIndexContent += `export const ${camelName} = \`${processedSvg.replace(/`/g, '\\`')}\`;\n`;

			const jsCode = await transform(
				svgCode,
				{
					plugins: [
						'@svgr/plugin-svgo',
						'@svgr/plugin-jsx',
						'@svgr/plugin-prettier',
					],
					icon: false,
					expandProps: 'end',
					typescript: true,
					replaceAttrValues: colorReplacements,
					ref: true,
					dimensions: false,
					svgoConfig: {
						plugins: [
							{
								name: 'convertColors',
								params: {
									currentColor: false,
									names2hex: true,
									rgb2hex: true,
									shorthex: false,
									shortname: true,
								},
							},
						],
					},
				},
				{ componentName: pascalName },
			);

			const reactOutputPath = path.join(reactOutputDir, `${pascalName}.tsx`);
			fs.writeFileSync(reactOutputPath, jsCode);
			console.log(`Created React component: ${reactOutputPath}`);

			reactIndexContent += `export { default as ${pascalName} } from './${pascalName}';\n`;
		} catch (error) {
			console.error(`Error processing ${file}:`, error);
		}
	}

	fs.writeFileSync(path.join(reactOutputDir, 'index.ts'), reactIndexContent);
	console.log('Created react/index.ts');

	fs.writeFileSync(path.join(svgOutputDir, 'index.ts'), svgIndexContent);
	console.log('Created svg/index.ts');
}

async function buildIcons() {
	const files = fs
		.readdirSync(iconDir)
		.filter((f: string) => f.endsWith('.svg'));

	let reactIndexContent = '';
	let svgIndexContent =
		'// Framework-agnostic icon SVG strings with currentColor theming\n\n';

	for (const file of files) {
		const svgPath = path.join(iconDir, file);
		const svgCode = fs.readFileSync(svgPath, 'utf8');
		const baseName = path.basename(file, '.svg');
		const pascalName = `${toPascalCase(baseName)}Icon`;
		const camelName = toCamelCase(baseName);

		try {
			const iconSvg = processIconSvg(svgCode);
			/* assertSinglePathIcon(iconSvg, file); */
			const withFontSize = ensureSvgAttribute(iconSvg, 'font-size', '1em');
			const withWidth = ensureSvgAttribute(withFontSize, 'width', '1em');
			const processedSvg = ensureSvgAttribute(withWidth, 'height', '1em');
			const svgOutputPath = path.join(iconSvgOutputDir, `${pascalName}.svg`);
			fs.writeFileSync(svgOutputPath, processedSvg);
			console.log(`Created icon SVG: ${svgOutputPath}`);

			svgIndexContent += `export const ${camelName} = \`${processedSvg.replace(/`/g, '\\`')}\`;\n`;

			const jsCode = await transform(
				processedSvg,
				{
					plugins: [
						'@svgr/plugin-svgo',
						'@svgr/plugin-jsx',
						'@svgr/plugin-prettier',
					],
					icon: true,
					expandProps: 'end',
					typescript: true,
					ref: true,
					dimensions: true,
					svgoConfig: {
						plugins: ['preset-default'],
						multipass: true,
						path: 'src',
					},
				},
				{ componentName: pascalName },
			);

			const reactOutputPath = path.join(
				iconReactOutputDir,
				`${pascalName}.tsx`,
			);
			fs.writeFileSync(reactOutputPath, jsCode);
			console.log(`Created icon React component: ${reactOutputPath}`);

			reactIndexContent += `export { default as ${pascalName} } from './${pascalName}';\n`;
		} catch (error) {
			throw new Error(`Error processing icon ${file}: ${String(error)}`);
		}
	}

	fs.writeFileSync(
		path.join(iconReactOutputDir, 'index.ts'),
		reactIndexContent,
	);
	console.log('Created icon-react/index.ts');

	fs.writeFileSync(path.join(iconSvgOutputDir, 'index.ts'), svgIndexContent);
	console.log('Created icon-svg/index.ts');
}

async function build() {
	await buildIllustrations();
	await buildIcons();
}

build().catch(console.error);
