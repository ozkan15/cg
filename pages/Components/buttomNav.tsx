import Link from 'next/link';
import styles from '../../styles/bottomNav.module.scss'
/*
page bottom navigation
*/
const BottomNav = () => {
    return (
        <div id={styles.bottomNav} className="container-fluid">
            <div className="row">
                <div className={styles.menuItemContainer}>
                    <Link href="/">
                        <a className={`${styles.menuItem} btn btn-bottom-navigation`} href="/">
                            <div className="icon"><i className="icon-home"></i></div>
                            <div className="text">Tournaments Listing</div>
                        </a>
                    </Link>
                    <Link href="/create">
                        <a className={`${styles.menuItem} btn btn-bottom-navigation`} href="/explore">
                            <div className="icon"><i className="icon-start-tournament"></i></div>
                            <div className="text">Add New</div>
                        </a>
                    </Link>
                    <Link href="">
                        <a className={`${styles.menuItem} btn btn-bottom-navigation`} href="/signUp">
                            <div className="icon"><i className="icon-signup"></i></div>
                            <div className="text">Sign In</div>
                        </a>
                    </Link>
                </div>
            </div>
        </div >
    );
};

export default BottomNav;