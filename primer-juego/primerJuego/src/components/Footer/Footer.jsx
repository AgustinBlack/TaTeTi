import clases from '../styles/Footer.module.css'

const Footer = () => {
    return (
        <footer>
            <section className={clases.padre}>
                <div>
                    <p>Este es mi link de Linkedin.</p>
                </div>
                <div>
                    <p>Este es mi link de GitHub.</p>
                </div>
                <div>
                    <p>Este es mi link de Mi Portfolio.</p>
                </div>
            </section>
        </footer>
    )
}

export default Footer