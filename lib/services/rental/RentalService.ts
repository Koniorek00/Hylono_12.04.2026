// import { db } from "@/lib/db"; // MOCKED FOR NOW
// If db is not available, we will use in-memory mock for now.

export type RentalStatus = 'PENDING_KYC' | 'PENDING_CONTRACT' | 'PENDING_PAYMENT' | 'ACTIVE' | 'RETURNED';

export interface CreateRentalInput {
    userId: string;
    items: string[]; // Array of TechType IDs
    termMonths: number;
}

export interface RentalApplication {
    id: string;
    userId: string;
    status: RentalStatus;
    items: string[];
    totalMonthly: number;
    contractUrl?: string;
    createdAt: Date;
}

class RentalService {

    // MOCK STORE (In a real app, this is Prisma)
    private _mockDb: RentalApplication[] = [];

    async createRental(input: CreateRentalInput): Promise<RentalApplication> {
        console.log("[RentalService] Creating rental application...", input);

        const newRental: RentalApplication = {
            id: `rent_${Math.random().toString(36).substr(2, 9)}`,
            userId: input.userId,
            status: 'PENDING_KYC',
            items: input.items,
            totalMonthly: 0, // Calculate based on pricing engine in real logic
            createdAt: new Date(),
        };

        this._mockDb.push(newRental);
        return newRental;
    }

    async getRental(id: string): Promise<RentalApplication | null> {
        return this._mockDb.find(r => r.id === id) || null;
    }

    async updateStatus(id: string, status: RentalStatus): Promise<void> {
        console.log(`[RentalService] Updating rental ${id} to ${status}`);
        const rental = this._mockDb.find(r => r.id === id);
        if (rental) {
            rental.status = status;
        }
    }
}

export const rentalService = new RentalService();
