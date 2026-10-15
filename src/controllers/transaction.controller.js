const transactionModel = require("../models/transaction.model")
const accountModel = require("../models/account.model")
const ledgerModel = require("../models/ledger.model")
const emailService = require("../services/email")

async function createTransaction(req, res) {

    // validate request
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body;
    
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "fromAccount, toAccount, Amount and idempotencyKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message: "Invalid fromAccount and toAccount"
        })
    }

    // validate idempotency key
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(200).json({
                message: "transaction is still processing"
            })
        }

        if(isTransactionAlreadyExists.status === "FAILED"){
            return res.status(500).json({
                message: "Transaction processing is failed please retry"
            })
        }

        if(isTransactionAlreadyExists.status === "REVERSED"){
            return res.status(500).json({
                message: "transaction is reversed please retry"
            })
        }
    }
}