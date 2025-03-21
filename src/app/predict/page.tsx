// File: /app/page.tsx

'use client';
import { useState } from 'react';
import Predict from '@/components/predict/page';
export default function Home() {
    return (
        <div>
            <Predict />
        </div>
    )
}