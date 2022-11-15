import React from "react";
import {
    ReflexContainer,
    ReflexSplitter,
    ReflexElement
  } from 'react-reflex'
  
  import 'react-reflex/styles.css'

  import styles from '../../styles/Home.module.scss'
  

export default function SplitPanel({children}) {
    const [expanded, setExpanded] = React.useState(true)

    console.log(children)
    return (
        <ReflexContainer orientation="vertical">
            {children.filter(c => c && c).reduce((accum, val, index) => [
                ...accum,
                <ReflexElement
                    style={{
                        flexDirection: 'column',
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

                index < (children.length-1) && <ReflexSplitter className="reflex-splitter-override" propagate={true}/>
            ], [])}
        </ReflexContainer>
    )
}