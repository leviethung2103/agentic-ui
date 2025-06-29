'use client';

import MyKnowledgePageComponent from '../../components/knowledge-base/MyKnowledgePage';
import { Suspense } from 'react';

export default function MyKnowledgePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MyKnowledgePageComponent />
        </Suspense>
    );
} 