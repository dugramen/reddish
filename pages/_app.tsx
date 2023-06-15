import '../styles/globals.scss'
import type { AppProps } from 'next/app'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
// import Head from 'next/head'
import Script from 'next/script'
config.autoAddCss = false

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/20.0.0/tween.umd.js"></Script>
      <Component {...pageProps} />
    </>
  ) 
}
