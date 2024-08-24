const cron = require('node-cron');

const profileService = require('../services/ProfileService');
const reservationService = require('../services/ReservationService');
const transactionService = require('../services/TransactionService');

const incrementPaymentStatus = cron.schedule('0 0 1 * *', async () => {
    try {
        await profileService.incrementPaymentStatus();
    } catch (error) {
        console.error('Error incrementing payment status:', error);
    }
});

const expireReservations = cron.schedule('*/5 * * * *', async () => {
    try {
        await reservationService.expireReservations();
    } catch (error) {
        console.error('Error expiring reservations:', error);
    }
});

const overdueTransactions = cron.schedule('*/5 * * * *', async () => {
    try {
        await transactionService.overdueTransactions();
    } catch (error) {
        console.error('Error overdue transactions:', error);
    }
});

module.exports = {
    incrementPaymentStatus,
    expireReservations,
    overdueTransactions
}