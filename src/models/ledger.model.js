const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "ledger must be assosiate with an account"],
        index: true,
        immutable: true
    },

    amount: {
        type: Number,
        required: [true, "Amount is required for creating a ledger entry"],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true, "Ledger must be assosiate with a transaction"],
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: ["CREDIT", "DEBIT"],
            message: "type can be credit or debit"
        },
        required: [true, "Ledger must be required"],
        immutable: true
    }
}, {
    timestamps: true
})

function preventLedgerModification(){
    throw new Error ("Ledger entries are immutable and cannot be modified or deleted")
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification)
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre('findOneAndRemove',preventLedgerModification)
ledgerSchema.pre('findOneAndUpdate', preventLedgerModification)
const ledgerModel = mongoose.model("ledger", ledgerSchema);
module.exports = ledgerModel;