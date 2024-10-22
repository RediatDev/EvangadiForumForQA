import React from "react";
import logo from "../../assets/evangadi-logo.png";
import './Header'
import { Link } from "react-router-dom";


function Header() {

	return (
		<div className="navbar headerMain navbar-expand-lg fixed-top shadow-sm">
			<div className="container px-md-4">
				<Link className="navbar-brand" to="/home">
					<img src={logo} alt="" />
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="offcanvas"
					data-bs-target="#offcanvasNavbar"
					aria-controls="offcanvasNavbar"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div
					className="offcanvas offcanvas-end"
					tabIndex="-1"
					id="offcanvasNavbar"
					aria-labelledby="offcanvasNavbarLabel"
				>
					<div className="offcanvas-header">
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="offcanvas"
							aria-label="Close"
						></button>
					</div>
					<div className="offcanvas-body links">
						<ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
							<li className="nav-item">
								<Link className="nav-link " to="/home">
									Home
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link">How it works</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}



export default Header;
