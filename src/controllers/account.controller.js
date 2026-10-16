const accountModel = require("../models/account.model")

async function createAccount(req, res){
    const user = req.user;

    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        message: "user account create successfully",
        account
    })
}

async function getUserAccount(req, res) {
    const account = await accountModel.find({
        user: req.user._id
    })
    res.status(200).json({
        message: "Fetch all user account successfully",
        account
    })
}

async function getAccountBalance(req, res){
    const {accountId} = req.params;
    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if(!account){
        return res.status(404).status({
            message: "Account not Found"
        })
    }

    const balance = await account.getBalance()

    res.status(200).json({
        accountId: accountId._id,
        balance: balance
    })
}

module.exports = {createAccount, getUserAccount, getAccountBalance};