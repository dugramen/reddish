import React from "react";
import {
    ReflexContainer,
    ReflexSplitter,
    ReflexElement
} from 'react-reflex'

import 'react-reflex/styles.css'

import styles from '../../styles/Home.module.scss'
  
interface Props {
    [a: string | symbol | number]: any,
    currentPanel, setCurrentPanel
}

export default function SplitPanel(props: Props) {
    const [expanded, setExpanded] = React.useState(true)
    const [width, setWidth] = React.useState(0)
    const {currentPanel, setCurrentPanel} = props

    const getWidth = () => setWidth(window.innerWidth)
    React.useEffect(() => {
        getWidth()
        window.addEventListener('resize', getWidth)
        return () => {
            window.removeEventListener('resize', getWidth)
        }
    }, [])
    const isMobile = width < 900

    const filteredChildren = props.children.filter(c => c !== false && c !== null)

    if (isMobile) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
            }}>
                <div style={{
                    display: 'flex',
                    width: '100%',
                    // overflowX: 'scroll',
                    height: 'minContent',
                }}>
                    {filteredChildren.map((child, index) => (
                        <button 
                            style={{
                                background: 'none',
                                border: 'none',
                                outline: 'none',
                                padding: '8px 20px',
                                margin: '8px 0px',
                                textDecoration: index === currentPanel ? 'underline' : ''
                            }}
                            onClick={() => {
                                setCurrentPanel(index)
                            }}
                        >
                            {' > ' + child.props.name}
                        </button>
                    ))}
                </div>

                <div style={{
                    display: 'flex',
                    minHeight: '0',
                    transform: `translateX(calc(-100vw * ${currentPanel}))`
                }}>
                    {filteredChildren.map(child => (
                        <div style={{
                            minWidth: '100vw',
                        }}>
                            {child}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <ReflexContainer orientation="vertical">
            {filteredChildren.reduce((accum, val, index) => [
                ...accum,
                <ReflexElement
                    key={index*2}
                    style={{
                        flexDirection: 'column',
                        height: 'auto'
                    }}
                >
                    <div
                        className={styles.PanelContainer}
                        style={{

                        }}
                    >
                        {val}
                    </div>
                </ReflexElement>,

                index !== (filteredChildren.length-1) && <ReflexSplitter 
                    className="reflex-splitter-override"   
                    propagate={true} 
                    key={index*2 + 1}
                    
                />
            ], [])}
        </ReflexContainer>
    )
}