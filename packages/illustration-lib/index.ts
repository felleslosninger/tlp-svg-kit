import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from '@svgr/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgDir = path.resolve(__dirname, '../svgs');
const outputDir = path.resolve(__dirname, './react');

fs.mkdirSync(outputDir, { recursive: true });

function toCamelCase(str: string): string {
	return str
		.replace(/-./g, (match) => match.charAt(1).toUpperCase())
		.replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
}

fs.readdir(svgDir, async (err, files) => {
	if (err) {
		console.error('Error reading SVG directory:', err);
		return;
	}

	let indexContent = '';

	for (const file of files) {
		if (path.extname(file) === '.svg') {
			const svgPath = path.join(svgDir, file);
			const svgCode = fs.readFileSync(svgPath, 'utf8');
			const componentName = toCamelCase(path.basename(file, '.svg'));

			try {
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
						replaceAttrValues: {
							white: 'var(--ds-color-neutral-surface-default)',
							'#fff': 'var(--ds-color-neutral-surface-default)',
							'#FFF': 'var(--ds-color-neutral-surface-default)',
							'#FFFFFF': 'var(--ds-color-neutral-surface-default)',
							'#1E2B3C': 'var(--ds-color-neutral-base-default)',
							'#EDCFC5': 'var(--ds-color-neutral-border-subtle)',
							'#F45F63': 'var(--ds-color-brand1-base-default)',
							'#E5AA20': 'var(--ds-color-brand2-base-default)',
							'#1E98F5': 'var(--ds-color-brand3-base-default)',
						},
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
					{ componentName },
				);

				const outputFilePath = path.join(outputDir, `${componentName}.tsx`);
				fs.writeFileSync(outputFilePath, jsCode);
				console.log(`Successfully created ${outputFilePath}`);

				indexContent += `export { default as ${componentName} } from './${componentName}'\n`;
			} catch (error) {
				console.error(`Error transforming ${file}:`, error);
			}
		}
	}

	fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);
	console.log('Successfully created index.ts');
});
