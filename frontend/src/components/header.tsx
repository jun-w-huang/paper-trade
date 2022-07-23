interface HeaderProps {
    username?: string
}


export default function Header(props: HeaderProps) {
    return (
        <div className="header" id="myHeader">
            <h2>Paper Trade</h2>
            {props.username && <p id="welcome"> Hi, {props.username}</p>}
        </div>
    )

}