import { Button, Search } from '@digdir/designsystemet-react';
import { useState } from 'react';
import Illustration from './_components/Illustration';
import './App.css';
import * as AllSvgs from '@digdir/illustration-lib';

function App() {
	const [colorScheme, setColorScheme] = useState('dark');
	const [searchValue, setSearchValue] = useState('');

	return (
		<>
			<div className="search-controls">
				<Search>
					<Search.Input
						placeholder="Search"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
					<Search.Clear onClick={() => setSearchValue('')} />
				</Search>
				<Button
					variant="secondary"
					onClick={() => {
						if (colorScheme === 'dark') {
							setColorScheme('light');
						} else {
							setColorScheme('dark');
						}
					}}
				>
					Change color scheme
				</Button>
			</div>
			<div className="svg-grid" data-color-scheme={colorScheme}>
				{Object.entries(AllSvgs).map(([name, Svg]) => {
					if (
						searchValue &&
						!name.toLowerCase().includes(searchValue.toLowerCase())
					) {
						return null;
					}
					return (
						<Illustration key={name} title={name}>
							<Svg />
						</Illustration>
					);
				})}
			</div>
		</>
	);
}

export default App;
