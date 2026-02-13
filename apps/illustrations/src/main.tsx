import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import '@digdir/designsystemet-css/theme.css';
import '@digdir/designsystemet-css';
import App from './app.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<BrowserRouter basename="/tlp-svg-kit">
				<App />
			</BrowserRouter>
		</StrictMode>,
	);
} else {
	throw new Error('Root element not found');
}
