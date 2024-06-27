const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const { DOWN, UP } = require("../../src/util");

var coverage = {
    composeMessage1: false,
    composeMessage2: false,
    composeMessage3: false,
    composeMessage4: false,
    composeMessage5: false,
};

class WeCom extends NotificationProvider {
    name = "WeCom";

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";

        try {
            let config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            let body = this.composeMessage(heartbeatJSON, msg);
            await axios.post(
                `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${notification.weComBotKey}`,
                body,
                config
            );
            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }

    /**
     * Generate the message to send
     * @param {object} heartbeatJSON Heartbeat details (For Up/Down only)
     * @param {string} msg General message
     * @returns {object} Message
     */
    composeMessage(heartbeatJSON, msg) {
        coverage.composeMessage1 = true;

        let title;
        if (
            msg != null &&
            heartbeatJSON != null &&
            heartbeatJSON["status"] === UP
        ) {
            coverage.composeMessage2 = true;

            title = "UptimeKuma Monitor Up";
        } else if (
            msg != null &&
            heartbeatJSON != null &&
            heartbeatJSON["status"] === DOWN
        ) {
            coverage.composeMessage3 = true;

            title = "UptimeKuma Monitor Down";
        } else if (msg != null) {
            coverage.composeMessage4 = true;

            title = "UptimeKuma Message";
        } else {
            coverage.composeMessage5 = true;

            title = "UptimeKuma Error: ";
            msg = "Unknown message";
        }
        return {
            msgtype: "text",
            text: {
                content: title + msg,
            },
        };
    }
}

module.exports = { WeCom, coverage };
