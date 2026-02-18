
import { Course, Device } from '../types';

// Mock Data for "Live" Biometrics Generation
export const generateBiometricData = (points: number, base: number, volatility: number) =>
    Array.from({ length: points }, (_, i) => ({
        time: `${i}:00`,
        value: base + Math.random() * volatility - (volatility / 2)
    }));

export const HRV_DATA = generateBiometricData(24, 65, 15);

export const TRAJECTORY_DATA = [
    { month: 'Now', standard: 85, hylono: 85 },
    { month: '3m', standard: 83, hylono: 92 },
    { month: '6m', standard: 82, hylono: 98 },
    { month: '9m', standard: 80, hylono: 105 },
    { month: '12m', standard: 78, hylono: 115 },
];

export const MOCK_COURSES: Course[] = [
    {
        id: '1',
        title: 'Hyperbaric Safety Fundamentals',
        description: 'Core protocols for pressure management.',
        progress: 100,
        modules: [{ title: 'Pressure Physics', completed: true }, { title: 'Emergency Venting', completed: true }],
        locked: false
    },
    {
        id: '2',
        title: 'Circadian Light Optimization',
        description: 'Timing RLT for hormonal balance.',
        progress: 45,
        modules: [{ title: 'Morning Gates', completed: true }, { title: 'Evening Red', completed: false }],
        locked: false
    }
];

export const MOCK_DEVICES: Device[] = [
    {
        id: 'd1',
        name: 'Hylono Chamber Pro',
        serial: 'HY-HBOT-2026-X99',
        status: 'ONLINE',
        lastSync: '2 mins ago',
        rentalExpiry: '2026-06-15'
    }
];
