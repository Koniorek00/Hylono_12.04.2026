"use client";

import React, { useEffect, useState } from 'react';
import Image, { type ImageProps } from 'next/image';

type OptimizedImageProps = Omit<ImageProps, 'loading'> & {
    fallbackSrc?: ImageProps['src'];
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    fallbackSrc,
    priority,
    sizes,
    onError,
    ...rest
}) => {
    const [resolvedSrc, setResolvedSrc] = useState<ImageProps['src']>(src);

    useEffect(() => {
        setResolvedSrc(src);
    }, [src]);

    return (
        <Image
            {...rest}
            src={resolvedSrc}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'}
            onError={(event) => {
                if (fallbackSrc && resolvedSrc !== fallbackSrc) {
                    setResolvedSrc(fallbackSrc);
                }

                onError?.(event);
            }}
        />
    );
};
