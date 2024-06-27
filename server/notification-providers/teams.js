const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const { setting } = require("../util-server");
const { DOWN, UP, getMonitorRelativeURL } = require("../../src/util");

var coverage = {
    statusMessageFactory: {
        status1: false,
        status2: false,
        status3: false,
    },
    getStyle: {
        style1: false,
        style2: false,
        style3: false,
    },
};

var ncoverage = {
    notificationPayloadFactory1: false,
    notificationPayloadFactory2: false,
    notificationPayloadFactory3: false,
    notificationPayloadFactory4: false,
    notificationPayloadFactory5: false,
    notificationPayloadFactory6: false,
    notificationPayloadFactory7: false,
    notificationPayloadFactory8: false,
    notificationPayloadFactory9: false,
    notificationPayloadFactory10: false,
    notificationPayloadFactory11: false,
    notificationPayloadFactory12: false,
};

class Teams extends NotificationProvider {
    name = "teams";

    /**
     * Generate the message to send
     * @param {const} status The status constant
     * @param {string} monitorName Name of monitor
     * @param {boolean} withStatusSymbol If the status should be prepended as symbol
     * @returns {string} Status message
     */
    _statusMessageFactory = (status, monitorName, withStatusSymbol) => {
        coverage.statusMessageFactory.status3 = true;
        if (status === DOWN) {
            coverage.statusMessageFactory.status1 = true;
            return (
                (withStatusSymbol ? "🔴 " : "") + `[${monitorName}] went down`
            );
        } else if (status === UP) {
            coverage.statusMessageFactory.status2 = true;
            return (
                (withStatusSymbol ? "✅ " : "") +
                `[${monitorName}] is back online`
            );
        }
        return "Notification";
    };

    /**
     * Select the style to use based on status
     * @param {const} status The status constant
     * @returns {string} Selected style for adaptive cards
     */
    _getStyle = (status) => {
        coverage.getStyle.style3 = true;
        if (status === DOWN) {
            coverage.getStyle.style1 = true;
            return "attention";
        }
        if (status === UP) {
            coverage.getStyle.style2 = true;
            return "good";
        }
        return "emphasis";
    };

    /**
     * Generate payload for notification
     * @param {object} args Method arguments
     * @param {object} args.heartbeatJSON Heartbeat details
     * @param {string} args.monitorName Name of the monitor affected
     * @param {string} args.monitorUrl URL of the monitor affected
     * @param {string} args.dashboardUrl URL of the dashboard affected
     * @returns {object} Notification payload
     */
    _notificationPayloadFactory = ({
        heartbeatJSON,
        monitorName,
        monitorUrl,
        dashboardUrl,
    }) => {
        const status = heartbeatJSON?.status;
        const facts = [];
        const actions = [];

        ncoverage.notificationPayloadFactory1 = true;

        if (dashboardUrl) {
            ncoverage.notificationPayloadFactory2 = true;

            actions.push({
                type: "Action.OpenUrl",
                title: "Visit Uptime Kuma",
                url: dashboardUrl,
            });
        } else {
            ncoverage.notificationPayloadFactory3 = true;
        }

        if (heartbeatJSON?.msg) {
            ncoverage.notificationPayloadFactory4 = true;

            facts.push({
                title: "Description",
                value: heartbeatJSON.msg,
            });
        } else {
            ncoverage.notificationPayloadFactory5 = true;
        }

        if (monitorName) {
            ncoverage.notificationPayloadFactory6 = true;

            facts.push({
                title: "Monitor",
                value: monitorName,
            });
        } else {
            ncoverage.notificationPayloadFactory7 = true;
        }

        if (monitorUrl && monitorUrl !== "https://") {
            ncoverage.notificationPayloadFactory8 = true;

            facts.push({
                title: "URL",
                // format URL as markdown syntax, to be clickable
                value: `[${monitorUrl}](${monitorUrl})`,
            });
            actions.push({
                type: "Action.OpenUrl",
                title: "Visit Monitor URL",
                url: monitorUrl,
            });
        } else {
            ncoverage.notificationPayloadFactory9 = true;
        }

        if (heartbeatJSON?.localDateTime) {
            ncoverage.notificationPayloadFactory10 = true;

            facts.push({
                title: "Time",
                value:
                    heartbeatJSON.localDateTime +
                    (heartbeatJSON.timezone
                        ? ` (${heartbeatJSON.timezone})`
                        : ""),
            });
        } else {
            ncoverage.notificationPayloadFactory11 = true;
        }

        const payload = {
            type: "message",
            // message with status prefix as notification text
            summary: this._statusMessageFactory(status, monitorName, true),
            attachments: [
                {
                    contentType: "application/vnd.microsoft.card.adaptive",
                    contentUrl: "",
                    content: {
                        type: "AdaptiveCard",
                        body: [
                            {
                                type: "Container",
                                verticalContentAlignment: "Center",
                                items: [
                                    {
                                        type: "ColumnSet",
                                        style: this._getStyle(status),
                                        columns: [
                                            {
                                                type: "Column",
                                                width: "auto",
                                                verticalContentAlignment:
                                                    "Center",
                                                items: [
                                                    {
                                                        type: "Image",
                                                        width: "32px",
                                                        style: "Person",
                                                        url: "https://raw.githubusercontent.com/louislam/uptime-kuma/master/public/icon.png",
                                                        altText:
                                                            "Uptime Kuma Logo",
                                                    },
                                                ],
                                            },
                                            {
                                                type: "Column",
                                                width: "stretch",
                                                items: [
                                                    {
                                                        type: "TextBlock",
                                                        size: "Medium",
                                                        weight: "Bolder",
                                                        text: `**${this._statusMessageFactory(
                                                            status,
                                                            monitorName,
                                                            false
                                                        )}**`,
                                                    },
                                                    {
                                                        type: "TextBlock",
                                                        size: "Small",
                                                        weight: "Default",
                                                        text: "Uptime Kuma Alert",
                                                        isSubtle: true,
                                                        spacing: "None",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: "FactSet",
                                separator: false,
                                facts: facts,
                            },
                        ],
                        $schema:
                            "http://adaptivecards.io/schemas/adaptive-card.json",
                        version: "1.5",
                    },
                },
            ],
        };

        if (actions) {
            ncoverage.notificationPayloadFactory12 = true;

            payload.attachments[0].content.body.push({
                type: "ActionSet",
                actions: actions,
            });
        }

        return payload;
    };

    /**
     * Send the notification
     * @param {string} webhookUrl URL to send the request to
     * @param {object} payload Payload generated by _notificationPayloadFactory
     * @returns {Promise<void>}
     */
    _sendNotification = async (webhookUrl, payload) => {
        await axios.post(webhookUrl, payload);
    };

    /**
     * Send a general notification
     * @param {string} webhookUrl URL to send request to
     * @param {string} msg Message to send
     * @returns {Promise<void>}
     */
    _handleGeneralNotification = (webhookUrl, msg) => {
        const payload = this._notificationPayloadFactory({
            heartbeatJSON: {
                msg: msg,
            },
        });

        return this._sendNotification(webhookUrl, payload);
    };

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";

        try {
            if (heartbeatJSON == null) {
                await this._handleGeneralNotification(
                    notification.webhookUrl,
                    msg
                );
                return okMsg;
            }

            const baseURL = await setting("primaryBaseURL");
            let dashboardUrl;
            if (baseURL) {
                dashboardUrl = baseURL + getMonitorRelativeURL(monitorJSON.id);
            }

            const payload = this._notificationPayloadFactory({
                heartbeatJSON: heartbeatJSON,
                monitorName: monitorJSON.name,
                monitorUrl: this.extractAdress(monitorJSON),
                dashboardUrl: dashboardUrl,
            });

            await this._sendNotification(notification.webhookUrl, payload);
            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }
}

module.exports = { Teams, coverage, ncoverage };
