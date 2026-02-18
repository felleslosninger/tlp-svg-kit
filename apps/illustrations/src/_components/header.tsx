import { NavLink } from 'react-router-dom';
import './header.css';

export default function Header() {
	return (
		<header className="site-header">
			<div className="site-header__logo">
				<NavLink to="/">
					<img
						className="site-header__logo-img"
						alt="Digdir assets"
						src={`${import.meta.env.BASE_URL}logo-white.svg`}
					/>
				</NavLink>
			</div>
			<nav className="site-header__nav">
				<NavLink
					to="/illustrations"
					className={({ isActive }) =>
						isActive
							? 'site-header__link site-header__link--active'
							: 'site-header__link'
					}
				>
					Illustrations
				</NavLink>
				{/* Icons link hidden for now
				<NavLink
					to="/icons"
					className={({ isActive }) =>
						isActive ? 'site-header__link site-header__link--active' : 'site-header__link'
					}
				>
					Icons
				</NavLink>
				*/}
			</nav>
		</header>
	);
}
