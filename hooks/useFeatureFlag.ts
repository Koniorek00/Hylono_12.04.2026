import { useEffect, useState } from 'react';
import { FeatureFlagName, isFeatureEnabled } from '../config/featureFlags';

export const useFeatureFlag = (flag: FeatureFlagName): boolean => {
  const [enabled, setEnabled] = useState<boolean>(() => isFeatureEnabled(flag));

  useEffect(() => {
    setEnabled(isFeatureEnabled(flag));

    const handleStorage = () => {
      setEnabled(isFeatureEnabled(flag));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [flag]);

  return enabled;
};
