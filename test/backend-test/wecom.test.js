const {
    WeCom,
    coverage,
} = require("../../server/notification-providers/wecom.js");
const { DOWN, UP } = require("../../src/util");

describe("WeCom", () => {
    let weCom;

    beforeEach(() => {
        weCom = new WeCom();
    });

    describe("composeMessage", () => {
        it("should return message with 'UptimeKuma Monitor Up' when status is UP and msg is not null", () => {
            const heartbeatJSON = { status: UP };
            const msg = " - Everything is fine.";
            const result = weCom.composeMessage(heartbeatJSON, msg);
            expect(result).toEqual({
                msgtype: "text",
                text: {
                    content: "UptimeKuma Monitor Up" + msg,
                },
            });
        });

        it("should return message with 'UptimeKuma Monitor Down' when status is DOWN and msg is not null", () => {
            const heartbeatJSON = { status: DOWN };
            const msg = " - Something is wrong.";
            const result = weCom.composeMessage(heartbeatJSON, msg);
            expect(result).toEqual({
                msgtype: "text",
                text: {
                    content: "UptimeKuma Monitor Down" + msg,
                },
            });
        });

        it("should return message with 'UptimeKuma Message' when msg is not null and heartbeatJSON is null", () => {
            const heartbeatJSON = null;
            const msg = " - General message.";
            const result = weCom.composeMessage(heartbeatJSON, msg);
            expect(result).toEqual({
                msgtype: "text",
                text: {
                    content: "UptimeKuma Message" + msg,
                },
            });
        });

        it("should return message with 'UptimeKuma Message' when msg is not null and heartbeatJSON does not have status", () => {
            const heartbeatJSON = {};
            const msg = " - General message.";
            const result = weCom.composeMessage(heartbeatJSON, msg);
            expect(result).toEqual({
                msgtype: "text",
                text: {
                    content: "UptimeKuma Message" + msg,
                },
            });
        });

        it("should return message with 'UptimeKuma Message' when msg is not null and status is not UP or DOWN", () => {
            const heartbeatJSON = { status: "UNKNOWN" };
            const msg = " - Unknown status.";
            const result = weCom.composeMessage(heartbeatJSON, msg);
            expect(result).toEqual({
                msgtype: "text",
                text: {
                    content: "UptimeKuma Message" + msg,
                },
            });
        });

        it("should return message with 'UptimeKuma Message' when only msg is provided", () => {
            const msg = " - Only message.";
            const result = weCom.composeMessage(null, msg);
            expect(result).toEqual({
                msgtype: "text",
                text: {
                    content: "UptimeKuma Message" + msg,
                },
            });
        });

        it("should return undefined when msg is null", () => {
            const heartbeatJSON = { status: UP };
            const result = weCom.composeMessage(heartbeatJSON, null);
            expect(result).toEqual({
                msgtype: "text",
                text: {
                    content: "UptimeKuma Error: Unknown message",
                },
            });
        });

        it("should cover all branches in WeCom.composeMessage", () => {
            const expectedCoverage = {
                composeMessage1: true,
                composeMessage2: true,
                composeMessage3: true,
                composeMessage4: true,
                composeMessage5: true,
            };

            expect(coverage).toEqual(expectedCoverage);
        });
    });
});
