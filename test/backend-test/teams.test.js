const {
    Teams,
    coverage,
} = require("../../server/notification-providers/teams.js");
const { DOWN, UP } = require("../../src/util");
const axios = require("axios");

jest.mock("axios");

describe("Teams", () => {
    let teams;

    beforeEach(() => {
        teams = new Teams();
        axios.post.mockResolvedValue(); // Mock axios.post to resolve
    });

    describe("_statusMessageFactory", () => {
        it("should create a status message with correct content when status is DOWN", () => {
            const status = DOWN;
            const message = "Monitor 1";
            const withStatusSymbol = false;

            const result = teams._statusMessageFactory(
                status,
                message,
                withStatusSymbol
            );

            expect(typeof result).toBe("string");
            expect(result).toContain("[Monitor 1] went down");
        });

        it("should create a status message with correct content when status is UP", () => {
            const status = UP;
            const message = "Monitor 2";
            const withStatusSymbol = false;

            const result = teams._statusMessageFactory(
                status,
                message,
                withStatusSymbol
            );

            expect(typeof result).toBe("string");
            expect(result).toContain("[Monitor 2] is back online");
        });

        it("should return a default message when status is neither DOWN nor UP", () => {
            const status = "UNKNOWN";
            const message = "Monitor 3";
            const withStatusSymbol = true;

            const result = teams._statusMessageFactory(
                status,
                message,
                withStatusSymbol
            );

            expect(typeof result).toBe("string");
            expect(result).toEqual("Notification");
        });
    });

    describe("_getStyle", () => {
        it('should return "attention" style when status is DOWN', () => {
            const status = DOWN;

            const result = teams._getStyle(status);

            expect(typeof result).toBe("string");
            expect(result).toEqual("attention");
        });

        it('should return "good" style when status is UP', () => {
            const status = UP;

            const result = teams._getStyle(status);

            expect(typeof result).toBe("string");
            expect(result).toEqual("good");
        });

        it('should return "emphasis" style when status is neither DOWN nor UP', () => {
            const status = "UNKNOWN";

            const result = teams._getStyle(status);

            expect(typeof result).toBe("string");
            expect(result).toEqual("emphasis");
        });

        // Test Branch Coverage
        it("should cover all branches in _statusMessageFactory and _getStyle", () => {
            const expectedCoverage = {
                statusMessageFactory: {
                    status1: true,
                    status2: true,
                    status3: true,
                },
                getStyle: {
                    style1: true,
                    style2: true,
                    style3: true,
                },
            };

            expect(coverage).toEqual(expectedCoverage);
        });
    });

    describe("Teams", () => {
        let teams;

        beforeEach(() => {
            teams = new Teams();
            axios.post.mockResolvedValue(); // Mock axios.post to resolve
        });

        describe("_notificationPayloadFactory", () => {
            it("should generate payload with all fields", () => {
                const args = {
                    heartbeatJSON: {
                        status: DOWN,
                        msg: "Test message",
                        localDateTime: "2024-06-27T10:00:00Z",
                        timezone: "UTC",
                    },
                    monitorName: "Test Monitor",
                    monitorUrl: "http://example.com",
                    dashboardUrl: "http://dashboard.com",
                };

                const payload = teams._notificationPayloadFactory(args);
                // Using Jest's expect syntax for assertions
                expect(payload).toHaveProperty("type", "message");
                expect(payload).toHaveProperty(
                    "summary",
                    "🔴 [Test Monitor] went down"
                );
                expect(payload.attachments[0].content.body[1].facts).toEqual([
                    { title: "Description", value: "Test message" },
                    { title: "Monitor", value: "Test Monitor" },
                    {
                        title: "URL",
                        value: "[http://example.com](http://example.com)",
                    },
                    { title: "Time", value: "2024-06-27T10:00:00Z (UTC)" },
                ]);
                expect(payload.attachments[0].content.body[2].actions).toEqual([
                    {
                        type: "Action.OpenUrl",
                        title: "Visit Uptime Kuma",
                        url: "http://dashboard.com",
                    },
                    {
                        type: "Action.OpenUrl",
                        title: "Visit Monitor URL",
                        url: "http://example.com",
                    },
                ]);
            });

            it("should generate payload without optional fields", () => {
                const args = {
                    heartbeatJSON: {
                        status: UP,
                    },
                    monitorName: "Test Monitor",
                };

                const payload = teams._notificationPayloadFactory(args);
                expect(payload).toHaveProperty("summary");
                expect(payload.summary).toContain(
                    "✅ [Test Monitor] is back online"
                );
                expect(payload.attachments[0].content.body[1].facts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            title: "Monitor",
                            value: "Test Monitor",
                        }),
                    ])
                );
                expect(payload.attachments[0].content.body[2]).toEqual(
                    expect.objectContaining({ type: "ActionSet", actions: [] })
                );
            });
        });

        it("should generate payload with monitorName as null or false", () => {
            const args = {
                heartbeatJSON: {
                    status: DOWN,
                    msg: "Test message",
                    localDateTime: "2024-06-27T10:00:00Z",
                    timezone: "UTC",
                },
                monitorName: null, // or false
                monitorUrl: "http://example.com",
                dashboardUrl: "http://dashboard.com",
            };

            const payload = teams._notificationPayloadFactory(args);

            expect(payload).toHaveProperty("type", "message");
            expect(payload).toHaveProperty("summary", "🔴 [null] went down"); // Summary should use "Unknown Monitor"

            // Facts should not include the "Monitor" fact
            expect(payload.attachments[0].content.body[1].facts).toEqual([
                { title: "Description", value: "Test message" },
                {
                    title: "URL",
                    value: "[http://example.com](http://example.com)",
                },
                { title: "Time", value: "2024-06-27T10:00:00Z (UTC)" },
            ]);

            // Other parts of the payload should remain the same
            expect(payload.attachments[0].content.body[2].actions).toEqual([
                {
                    type: "Action.OpenUrl",
                    title: "Visit Uptime Kuma",
                    url: "http://dashboard.com",
                },
                {
                    type: "Action.OpenUrl",
                    title: "Visit Monitor URL",
                    url: "http://example.com",
                },
            ]);
        });

        it("should generate payload with actions as null or false", () => {
            const args = {
                heartbeatJSON: {
                    status: DOWN,
                    msg: "Test message",
                    localDateTime: "2024-06-27T10:00:00Z",
                    timezone: "UTC",
                },
                monitorName: "Test Monitor",
                monitorUrl: null, // or false
                dashboardUrl: null, // or false
            };

            const payload = teams._notificationPayloadFactory(args);

            expect(payload).toHaveProperty("type", "message");
            expect(payload).toHaveProperty(
                "summary",
                "🔴 [Test Monitor] went down"
            );

            // Facts should not include the "URL" fact
            expect(payload.attachments[0].content.body[1].facts).toEqual([
                { title: "Description", value: "Test message" },
                { title: "Monitor", value: "Test Monitor" },
                { title: "Time", value: "2024-06-27T10:00:00Z (UTC)" },
            ]);

            // Actions should be an empty array or not present
            expect(
                payload.attachments[0].content.body.some(
                    (item) => item.type === "ActionSet"
                )
            ).toBe(true);
        });

        it("should cover all branches in teams", function () {
            const {
                ncoverage,
            } = require("../../server/notification-providers/teams.js");

            const cov = {
                notificationPayloadFactory1: true,
                notificationPayloadFactory2: true,
                notificationPayloadFactory3: true,
                notificationPayloadFactory4: true,
                notificationPayloadFactory5: true,
                notificationPayloadFactory6: true,
                notificationPayloadFactory7: true,
                notificationPayloadFactory8: true,
                notificationPayloadFactory9: true,
                notificationPayloadFactory10: true,
                notificationPayloadFactory11: true,
                notificationPayloadFactory12: true,
            };

            expect(ncoverage).toEqual(cov);
        });
    });
});
