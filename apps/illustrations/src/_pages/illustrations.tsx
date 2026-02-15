import { Field, Label, Search } from '@digdir/designsystemet-react';
import { useMemo, useRef, useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import DetailPanel from '../_components/detail-panel';
import Illustration from '../_components/illustration';
import '@digdir/illustration-lib/styles.css';
import * as AllSvgs from '@digdir/illustration-lib/react';

type SelectedIllustration = {
	name: string;
	Svg: ComponentType<SVGProps<SVGSVGElement>>;
} | null;

const allEntries = Object.entries(AllSvgs);
const totalCount = allEntries.length;

export default function IllustrationsPage() {
	const [searchValue, setSearchValue] = useState('');
	const [selected, setSelected] = useState<SelectedIllustration>(null);
	const selectedButtonRef = useRef<HTMLButtonElement>(null);

	const filteredEntries = useMemo(() => {
		if (!searchValue) return allEntries;
		return allEntries.filter(([name]) =>
			name.toLowerCase().includes(searchValue.toLowerCase()),
		);
	}, [searchValue]);

	const filteredCount = filteredEntries.length;

	return (
		<div className={`page-layout ${selected ? 'page-layout--panel-open' : ''}`}>
			<div className="page-content">
				<div className="page-intro">
					<p>
						Klikk på en illustrasjon for å se detaljer og kopiere SVG. For
						automatisk støtte for lys/mørk modus, inkluder CSS-filen:
					</p>
					<pre className="page-intro__code">
						import '@digdir/illustration-lib/styles.css';
					</pre>
				</div>
				<div className="search-controls">
					<Field>
						<Label>Søk i illustrasjoner</Label>
						<Search>
							<Search.Input
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
							/>
							<Search.Clear onClick={() => setSearchValue('')} />
						</Search>
					</Field>
					<p className="ds-sr-only" aria-live="polite" aria-atomic="true">
						{searchValue
							? `Viser ${filteredCount} av ${totalCount} illustrasjoner`
							: ''}
					</p>
				</div>
				<p className="results-count" aria-hidden="true">
					{filteredCount} av {totalCount} illustrasjoner
				</p>
				<div className="svg-grid" aria-label="Illustrasjoner">
					{filteredEntries.map(([name, Svg]) => (
						<Illustration
							key={name}
							ref={selected?.name === name ? selectedButtonRef : undefined}
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
					))}
				</div>
			</div>
			{selected && (
				<DetailPanel
					title={selected.name}
					Svg={selected.Svg}
					onClose={() => setSelected(null)}
					triggerRef={selectedButtonRef}
				/>
			)}
		</div>
	);
}
