import { useCircadian } from '../context/CircadianContext';
import { DAY_THEME, NIGHT_THEME } from '../constants/themes';

export const useCircadianTheme = () => {
    const { mode } = useCircadian();
    return mode === 'DAY' ? DAY_THEME : NIGHT_THEME;
};
