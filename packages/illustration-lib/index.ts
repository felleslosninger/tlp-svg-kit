import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from '@svgr/core';
import { optimize } from 'svgo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgDir = path.resolve(__dirname, '../svgs');
const reactOutputDir = path.resolve(__dirname, './react');
const svgOutputDir = path.resolve(__dirname, './svg');

fs.mkdirSync(reactOutputDir, { recursive: true });
fs.mkdirSync(svgOutputDir, { recursive: true });

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

async function build() {
	const files = fs.readdirSync(svgDir).filter((f) => f.endsWith('.svg'));

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

build().catch(console.error);
