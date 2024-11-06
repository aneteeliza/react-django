export default function Navbar(){
    return <nav className="nav">
        <a href="/" className="site-title">Larvijas Kara muzejs</a>
        <ul>
            <CustomLink href="/about">Par datu bāzi</CustomLink>
            <CustomLink href="/contacts">Kontakti</CustomLink>
        </ul>
    </nav>
}

function CustomLink({href, children, ...props}){
    const path = window.location.pathname
    return (
        <li className={path === href ? "active" : ""}>
            <a href={href} {...props}>{children}</a>
        </li>
    )
}