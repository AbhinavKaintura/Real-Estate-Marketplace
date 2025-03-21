'use client';
import { useState } from 'react';
import Predict from '@/components/predict/page';
import Navbar from '@/components/nav-bar/page';
import Footer from '@/components/footer/page';

export default function Prediction() {
    return (
        <div>
            <Navbar />
            <Predict />
            <Footer />
        </div>
    )
}