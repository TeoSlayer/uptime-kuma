const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const {
    Bark,
    coverage,
} = require("../../server/notification-providers/bark.js");

describe("Bark API Test Suite", () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    afterAll(() => {
        if (mock) {
            mock.restore();
        }
    });

    // Additional Parameters
    it("should return additional parameters with all options", () => {
        const notification = { barkGroup: "TestGroup", barkSound: "TestSound" };
        const barkInstance = new Bark();
        const params = barkInstance.additionalParameters(notification);

        expect(params).toContain("icon=");
        expect(params).toContain("&group=TestGroup");
        expect(params).toContain("&sound=TestSound");
    });

    it("should return additional parameters with default values", () => {
        const notification = {};
        const barkInstance = new Bark();
        const params = barkInstance.additionalParameters(notification);

        expect(params).toContain("icon=");
        expect(params).toContain("&group=UptimeKuma");
        expect(params).toContain("&sound=telegraph");
    });

    it("should return additional parameters with default sound", () => {
        const notification = { barkGroup: "TestGroup" };
        const barkInstance = new Bark();
        const params = barkInstance.additionalParameters(notification);

        expect(params).toContain("icon=");
        expect(params).toContain("&group=TestGroup");
        expect(params).toContain("&sound=telegraph");
    });

    // Check Result
    it("should not throw error for valid result", () => {
        const result = { status: 200 };
        const barkInstance = new Bark();
        expect(() => barkInstance.checkResult(result)).not.toThrow();
    });

    it("should throw error for invalid result without status", () => {
        const result = {};
        const barkInstance = new Bark();
        expect(() => barkInstance.checkResult(result)).toThrow(
            "Bark notification failed with invalid response!"
        );
    });

    it("should throw error for invalid result with non-2xx status", () => {
        const result = { status: 400 };
        const barkInstance = new Bark();
        expect(() => barkInstance.checkResult(result)).toThrow(
            "Bark notification failed with status code 400"
        );
    });

    // Test Branch Coverage
    it("should cover all branches in bark", () => {
        const expectedCoverage = {
            additionalParameters1: true,
            additionalParameters2: true,
            additionalParameters3: true,
            additionalParameters4: true,
            additionalParameters5: true,
            checkResult1: true,
            checkResult2: true,
            checkResult3: true,
        };

        expect(coverage).toEqual(expectedCoverage);
    });
});
