import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import '../design-tokens-build/digdir.css';
import '@digdir/designsystemet-css';
import App from './app.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<HashRouter>
				<App />
			</HashRouter>
		</StrictMode>,
	);
} else {
	throw new Error('Root element not found');
}
