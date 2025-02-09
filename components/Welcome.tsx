"use client"

import React, { useState, useEffect } from 'react'
import { Button } from './button'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import animationData from '@/animations/Loading.json'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const Welcome = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [animationError, setAnimationError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!animationData || typeof animationData !== 'object') {
            setAnimationError('Animation data is invalid or not found');
        }
    }, []);

    const handleClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            router.push('/auth');
        }, 2000);
    };

    if (isLoading) {
        return (
            <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                {animationError ? (
                    <div className="text-white">{animationError}</div>
                ) : (
                    <div className="w-64 h-64"> {/* Adjust size as needed */}
                        {animationData && (
                            <Lottie 
                                animationData={animationData} 
                                loop={true}
                                onError={() => setAnimationError('Failed to load animation')}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                Welcome

                {/* Button */}
                <div>
                    <Button onClick={handleClick} variant={"default"}>
                        Welcome
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Welcome
