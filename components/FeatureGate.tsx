import React from 'react';
import { FeatureFlagName } from '../config/featureFlags';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

interface FeatureGateProps {
  flag: FeatureFlagName;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ flag, children, fallback = null }) => {
  const enabled = useFeatureFlag(flag);

  if (!enabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
