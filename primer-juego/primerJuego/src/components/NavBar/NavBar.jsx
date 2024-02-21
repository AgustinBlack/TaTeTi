import clases from './NavBar.module.css'
import { Link } from 'react-router-dom'

const NavBar = () => {
    return (
        <>
            <div className={clases.padre}>
                <Link to={'/TaTeTi'} className={clases.links} ><img alt='' src=''/> TaTeTi</Link>
                <Link to={'/TaTeTi'} className={clases.links} ><img alt='' src=''/> Cuatro en linea</Link>
            </div>
        </>
    )
}

export default NavBar