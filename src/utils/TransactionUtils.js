const Transaction = require('../models/TransactionSchema');
const Profile = require("../models/ProfileSchema");
const Book = require("../models/BookSchema");

const executeTransactionUpdate = async (transactionId, transactionData, librarian, session) => {
    const tempTransaction = await Transaction.findById(transactionId).session(session);
    if (!tempTransaction) throw new Error("Transaction not found. Try again!");

    const [profile, books] = await Promise.all([
        Profile.findById(tempTransaction.member).session(session),
        Book.find({_id: {$in: tempTransaction.books}}).session(session)
    ]);

    if (!profile) throw new Error("Member not found. Try again!");
    if (!books || books.length === 0) throw new Error("Books not found. Try again!");

    if ('RETURNED' === transactionData.status) {
        if ('RETURNED' === tempTransaction.status) {
            throw new Error(`Transaction is already ${tempTransaction.status.toLowerCase()}!`);
        }

        books.forEach((book) => {
            book.availableCount += 1;
        });
        profile.borrowCount -= books.length;
    } else if ('BORROWED' === transactionData.status) {
        if ('BORROWED' === tempTransaction.status) throw new Error("Books are already borrowed!");

        books.forEach((book) => {
            book.availableCount -= 1;
        });
        profile.borrowCount += books.length;
    }

    await Promise.all([
        profile.save({session}),
        ...books.map(book => book.save({session}))
    ]);

    const transaction = await Transaction.findByIdAndUpdate(transactionId, {
        $set: {
            status: transactionData.status,
            librarian: librarian,
            returnedAt: 'RETURNED' === transactionData.status ? Date.now() : undefined
        }
    }, {new: true, runValidators: true, session});

    return transaction;
};

module.exports = {executeTransactionUpdate};
