import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './_components/header';
import IconsPage from './_pages/icons';
import IllustrationsPage from './_pages/illustrations';
import './app.css';

function App() {
	return (
		<div className="app-layout">
			<Header />
			<main className="app-main">
				<Routes>
					<Route path="/" element={<Navigate to="/illustrations" replace />} />
					<Route path="/illustrations" element={<IllustrationsPage />} />
					<Route path="/icons" element={<IconsPage />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
