import React from "react";
import Card from "../Card";
import {CardProps} from '../Card';
import parse from 'html-react-parser'
import styles from '../../styles/Post.module.scss'

interface Props extends CardProps {
    currentPost: {
        [a: string | number | symbol]: any,
    },
    setCurrentPost: any,
}

export default function Post(props: Props) {
    const {currentPost, setCurrentPost} = props
    return (
    <div
        className={styles.postContainer}
    >
        <h1>
            {currentPost?.title ?? ''}
        </h1>

        {parse(currentPost?.selftext_html ?? '')}

        {currentPost?.media_embed?.content &&
        <div className={styles.embeddedContent}>
            {parse(currentPost?.media_embed?.content ?? '')}
        </div>
        }

        {
        currentPost?.post_hint === 'image'? 
            <img
            className='post-image'
            src={currentPost?.url}
            alt='image'
            />
        :
        currentPost?.post_hint === 'link'? 
            <div>
            <a
                className={styles.link}
                href={currentPost?.url}
                style={{
                    maxWidth: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    // flexWrap: 'wrap',
                }}
            >
                <img
                    src={(currentPost?.preview?.images[0]?.source?.url ?? '').replaceAll('amp;', '')}
                    width={100}
                    height={100}
                    alt='preview'
                />

                <h4>
                    {currentPost?.url}
                </h4>
            </a>
            </div>
        :
        ''
        }
    </div>
    )
}