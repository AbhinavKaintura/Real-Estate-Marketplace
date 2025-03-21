import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/nav-bar/page';
import { m as motion, LazyMotion, domAnimation } from 'framer-motion';
import Head from 'next/head';


export default function Home() {
  return (

    <LazyMotion features={domAnimation} >
    <div className="min-h-screen">
        <Head>
          <title>Endurance States | Design Creates Culture</title>
          <meta name="description" content="We are a design-driven agency creating meaningful digital experiences." />
        </Head>
      <main>
        <Navbar/>
      </main>
      <Link href="/price-prediction">Predict Price</Link>

    </div>
    </LazyMotion>
    
  )
}