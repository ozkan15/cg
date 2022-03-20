import Link from 'next/link';
import styles from '../../styles/header.module.scss';

const Header = () => {
    return (
        <div id="header" className={`${styles.pageHeader} container-fluid`}>
            <div id="headerLogoContainer" className="logo-container">
                <Link href="/">
                    <a className="logo-link"><img
                        src="https://assets.communitygaming.io/logo/header-logo-2021.svg" alt="Community Gaming"
                        className="img img-responsive" /></a>
                </Link>
            </div>
            <div id="headerMainMenuContainer" className="">
                <div id="headerMainMenuOverlayContainer">
                    <div id="headerMainMenuOverlayMenuContainer">
                        <div className="menu-item-container first">
                            <Link href="/">
                                <a className="menu-item btn btn-black">Tournaments Listing</a>
                            </Link>
                            <Link href="/create">
                                <a className="menu-item btn btn-black">Add New</a>
                            </Link>
                            <Link href="">
                                <a className="menu-item btn btn-black">Sign In</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;