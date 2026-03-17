import { TechType, TechData } from '../types';
import { TECH_DETAILS } from '../constants';
import { KNOWLEDGE_REGISTRY, KnowledgePack } from '../constants/knowledge';

/**
 * useTech Hook
 * SSOT for technology data, SEO metadata, and compliance-traced claims.
 */

const ALL_TECH = Object.values(TECH_DETAILS);

export const useTech = () => {

    /**
     * Get specific tech details by type
     */
    const getTechDetails = (type: TechType): TechData => {
        return TECH_DETAILS[type];
    };

    /**
     * Get compliance knowledge for a tech type
     */
    const getTechKnowledge = (type: TechType): KnowledgePack | undefined => {
        // Map TechType (enum) to Registry Key (string)
        const keyMap: Partial<Record<TechType, keyof typeof KNOWLEDGE_REGISTRY>> = {
            [TechType.HBOT]: 'HBOT',
            [TechType.PEMF]: 'PEMF',
            [TechType.RLT]: 'RLT',
            [TechType.HYDROGEN]: 'HYDROGEN',
            [TechType.EWOT]: 'EWOT',
            [TechType.SAUNA_BLANKET]: 'SAUNA_BLANKET',
            [TechType.EMS]: 'EMS',
            [TechType.VNS]: 'VNS',
            [TechType.HYPOXIC]: 'HYPOXIC',
            [TechType.CRYO]: 'CRYO',
        };

        const knowledgeKey = keyMap[type];
        if (!knowledgeKey) return undefined;

        return KNOWLEDGE_REGISTRY[knowledgeKey];
    };

    /**
     * List all available technologies
     */
    const getAllTech = (): TechData[] => {
        return ALL_TECH;
    };

    /**
     * Helper to find a tech type by a slug/string
     */
    const findTechByType = (typeStr: string): TechType | undefined => {
        return Object.values(TechType).find(t => t === typeStr);
    };

    return {
        getTechDetails,
        getTechKnowledge,
        getAllTech,
        findTechByType,
        allTech: ALL_TECH
    };
};
