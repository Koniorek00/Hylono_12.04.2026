
export interface ContractTemplate {
    templateId: string;
    signers: { role: string; name: string; email: string }[];
}

class ContractService {

    async generateContractUrl(rentalId: string, userEmail: string): Promise<string> {
        console.log(`[ContractService] Generating contract for Rental ${rentalId} -> ${userEmail}`);

        // MOCK: Return a dummy URL or a direct link to a PDF for now
        // In production, this would call HelloSign API to create an embedded signing session
        return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    }

    async checkSignatureStatus(envelopeId: string): Promise<boolean> {
        // MOCK: Always return true for happy path testing
        console.log(`[ContractService] Checking status for envelope ${envelopeId}`);
        return true;
    }
}

export const contractService = new ContractService();
