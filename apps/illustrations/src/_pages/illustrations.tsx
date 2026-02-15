import { Field, Label, Search } from '@digdir/designsystemet-react';
import { useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import DetailPanel from '../_components/detail-panel';
import Illustration from '../_components/illustration';
import '@digdir/illustration-lib/styles.css';
import * as AllSvgs from '@digdir/illustration-lib/react';

type SelectedIllustration = {
	name: string;
	Svg: ComponentType<SVGProps<SVGSVGElement>>;
} | null;

export default function IllustrationsPage() {
	const [searchValue, setSearchValue] = useState('');
	const [selected, setSelected] = useState<SelectedIllustration>(null);

	return (
		<div className={`page-layout ${selected ? 'page-layout--panel-open' : ''}`}>
			<div className="page-content">
				<div className="page-intro">
					<p>
						Click an illustration to see details and copy SVG. For web usage
						with automatic light/dark mode support, include the CSS file:
					</p>
					<pre className="page-intro__code">
						import '@digdir/illustration-lib/styles.css';
					</pre>
				</div>
				<div className="search-controls">
					<Field>
						<Label>Search illustrations</Label>
						<Search>
							<Search.Input
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
							/>
							<Search.Clear onClick={() => setSearchValue('')} />
						</Search>
					</Field>
				</div>
				<div className="svg-grid">
					{Object.entries(AllSvgs).map(([name, Svg]) => {
						if (
							searchValue &&
							!name.toLowerCase().includes(searchValue.toLowerCase())
						) {
							return null;
						}
						return (
							<Illustration
								key={name}
								title={name}
								isSelected={selected?.name === name}
								onClick={() => {
									if (selected?.name === name) {
										setSelected(null);
										return;
									}
									setSelected({ name, Svg });
								}}
							>
								<Svg />
							</Illustration>
						);
					})}
				</div>
			</div>
			{selected && (
				<DetailPanel
					title={selected.name}
					Svg={selected.Svg}
					onClose={() => setSelected(null)}
				/>
			)}
		</div>
	);
}
