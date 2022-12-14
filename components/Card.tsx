import React from "react";

export interface CardProps {
    isShown?: boolean,
    className?: string,
    isMobile?: boolean,
    onClose?: () => any,
    [a: string | number | symbol]: any,
}

export default function Card(props: CardProps) {
    const [shouldRender, setShouldRender] = React.useState(true)
    const timeoutID = React.useRef<any>()

    React.useEffect(() => {
        if (timeoutID !== undefined || timeoutID !== null) {
            clearTimeout(timeoutID.current)
        }
        if (props.isShown) {
            setShouldRender(true)
        }
        else {
            timeoutID.current = setTimeout(() => setShouldRender(false), 300)
        }
    }, [props.isShown])

    return (
    <div className={`CardPage ${props.className} ${props.isShown? 'shown': 'hidden'}`}>
        <button className={`close-button ${props.isMobile && 'mobile'}`} onClick={props.onClose}>
            X
        </button>
        <div className="content-container">
            {props.children}
            {/* {shouldRender && props.children} */}
        </div>
    </div>
    )
}