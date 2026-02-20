import { Client } from 'discord.js';

/**
 * 
 * @param {Client} client
 */

export default (client) => {
    process.on('unhandledRejection', (reason, promise) => {
        console.log('Unhandled Rejection Error:');
        console.error(reason, promise);
    });

    process.on('uncaughtException', (reason, promise) => {
        console.log('Uncaught Exception Error:');
        console.error(reason, promise);
    });

    process.on('uncaughtExceptionMonitor', (reason, promise) => {
        console.log('Uncaught Exception Monitor Error:');
        console.error(reason, promise);
    });

    process.on('multipleResolves', (type, promise, reason) => {
        console.log('Multiple Resolves Error:');
        console.error(type, promise, reason);
    });
};