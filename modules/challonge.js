"use strict";

const request = require('request');

exports.ChallongeCommands = class ChallongeCommands {
    constructor(config) {
        this.config = config;
    }

    getUserCommands() {
        let self = this;
        let commands = {
        };
        return commands;
    }
};