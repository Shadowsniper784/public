"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const config_1 = __importDefault(require("../models/config"));
module.exports = {
    description: 'Displays or sets the prefix for the current guild',
    category: 'Configuration',
    permissions: ['ADMINISTRATOR'],
    maxArgs: 1,
    expectedArgs: '[prefix]',
    cooldown: '2s',
    slash: 'both',
    callback: async (options) => {
        const { channel, args, text, instance } = options;
        const { guild } = channel;
        if (args.length === 0) {
            return instance.messageHandler.get(guild, 'CURRENT_PREFIX', {
                PREFIX: instance.getPrefix(guild),
            });
        }
        if (guild) {
            const { id } = guild;
            if (!instance.isDBConnected()) {
                return instance.messageHandler.get(guild, 'NO_DATABASE_FOUND');
            }
            await config_1.default.findOneAndUpdate({
                _id: id,
            }, {
                _id: id,
                prefix: text,
            }, {
                upsert: true,
            });
            instance.setPrefix(guild, text);
            return instance.messageHandler.get(guild, 'SET_PREFIX', {
                PREFIX: text,
            });
        }
        return instance.messageHandler.get(guild, 'CANNOT_SET_PREFIX_IN_DMS');
    },
};
