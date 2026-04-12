package com.hylono.app.data.operations

import com.hylono.app.domain.operations.BookingRequestDraft
import com.hylono.app.domain.operations.ContactInquiryDraft
import com.hylono.app.domain.operations.HylonoOperationsGateway
import com.hylono.app.domain.operations.OperationReceipt
import com.hylono.app.domain.operations.RentalApplicationDraft

class SeedOperationsGateway : HylonoOperationsGateway {
    override suspend fun submitContact(draft: ContactInquiryDraft): OperationReceipt {
        return OperationReceipt(
            reference = "CT-DEMO-2041",
            message = "Support request staged for POST /api/contact."
        )
    }

    override suspend fun submitBooking(draft: BookingRequestDraft): OperationReceipt {
        return OperationReceipt(
            reference = "BK-DEMO-782A",
            message = "Advisor callback staged for POST /api/booking."
        )
    }

    override suspend fun submitRental(draft: RentalApplicationDraft): OperationReceipt {
        return OperationReceipt(
            reference = "RENT-DEMO-441",
            message = "Rental application staged for POST /api/rental."
        )
    }
}
