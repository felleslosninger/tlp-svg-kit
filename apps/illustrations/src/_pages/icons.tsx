import { Field, Label, Search } from '@digdir/designsystemet-react';
import * as AllIcons from '@digdir/illustration-lib/icons/react';
import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { ComponentType, SVGProps } from 'react';
import IconDetailPanel from '../_components/icon-detail-panel';
import IconTile from '../_components/icon-tile';

type SelectedIcon = {
	name: string;
	Icon: ComponentType<SVGProps<SVGSVGElement>>;
} | null;

const allEntries = Object.entries(AllIcons) as Array<
	[string, ComponentType<SVGProps<SVGSVGElement>>]
>;
const totalCount = allEntries.length;

export default function IconsPage() {
	const [searchValue, setSearchValue] = useState('');
	const [selected, setSelected] = useState<SelectedIcon>(null);
	const selectedButtonRef = useRef<HTMLButtonElement>(null);

	const filteredEntries = useMemo(() => {
		if (!searchValue) return allEntries;
		return allEntries.filter(([name]) =>
			name.toLowerCase().includes(searchValue.toLowerCase()),
		);
	}, [searchValue]);

	const filteredCount = filteredEntries.length;

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	return (
		<div className={`page-layout ${selected ? 'page-layout--panel-open' : ''}`}>
			<div className="page-content">
				<div className="page-intro page-intro--tight">
					<p>Klikk på et ikon for detaljer og kopiering.</p>
					<pre className="page-intro__code">
						{
							"import { BevisIcon } from '@digdir/illustration-lib/icons/react';"
						}
					</pre>
				</div>
				<div className="search-controls search-controls--tight">
					<Field>
						<Label>Søk i ikoner</Label>
						<Search>
							<Search.Input value={searchValue} onChange={handleSearchChange} />
							<Search.Clear onClick={() => setSearchValue('')} />
						</Search>
					</Field>
					<p className="ds-sr-only" aria-live="polite" aria-atomic="true">
						{searchValue
							? `Viser ${filteredCount} av ${totalCount} ikoner`
							: ''}
					</p>
				</div>
				<p className="results-count" aria-hidden="true">
					{filteredCount} av {totalCount} ikoner
				</p>
				<div className="icon-grid" aria-label="Ikoner">
					{filteredEntries.map(([name, Icon]) => (
						<IconTile
							key={name}
							ref={selected?.name === name ? selectedButtonRef : undefined}
							name={name}
							isSelected={selected?.name === name}
							onClick={() => {
								if (selected?.name === name) {
									setSelected(null);
									return;
								}
								setSelected({ name, Icon });
							}}
						>
							<Icon />
						</IconTile>
					))}
				</div>
			</div>
			{selected && (
				<IconDetailPanel
					name={selected.name}
					Icon={selected.Icon}
					onClose={() => setSelected(null)}
					triggerRef={selectedButtonRef}
				/>
			)}
		</div>
	);
}
