import React from 'react';
import Link from 'next/link';


export default function Home() {
  return (

    <div>Hlo from the home page

      <Link href="/predict">Predict Price</Link>
    </div>
  )
}