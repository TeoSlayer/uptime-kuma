describe("Bark API Test Suite", function () {
    let expect, sinon, axios, MockAdapter, Bark, mock;

    before(async function () {
        const chaiModule = await import("chai");
        expect = chaiModule.expect;

        sinon = (await import("sinon")).default;
        axios = (await import("axios")).default;
        MockAdapter = (await import("axios-mock-adapter")).default;
        BarkModule = await import(
            "../../server/notification-providers/bark.js"
        );
        Bark = BarkModule.Bark;
        coverage = BarkModule.coverage;

        mock = new MockAdapter(axios);
    });

    after(function () {
        if (mock) {
            mock.restore();
        }
    });

    // Additional Parameters
    it("should return additional parameters with all options", function () {
        const notification = { barkGroup: "TestGroup", barkSound: "TestSound" };
        const barkInstance = new Bark();
        const params = barkInstance.additionalParameters(notification);

        expect(params).to.contain("icon=");
        expect(params).to.contain("&group=TestGroup");
        expect(params).to.contain("&sound=TestSound");
    });

    it("should return additional parameters with default values", function () {
        const notification = {};
        const barkInstance = new Bark();
        const params = barkInstance.additionalParameters(notification);

        expect(params).to.contain("icon=");
        expect(params).to.contain("&group=UptimeKuma");
        expect(params).to.contain("&sound=telegraph");
    });

    it("should return additional parameters with default sound", function () {
        const notification = { barkGroup: "TestGroup" };
        const barkInstance = new Bark();
        const params = barkInstance.additionalParameters(notification);

        expect(params).to.contain("icon=");
        expect(params).to.contain("&group=TestGroup");
        expect(params).to.contain("&sound=telegraph");
    });

    // Check Result
    it("should not throw error for valid result", function () {
        const result = { status: 200 };
        const barkInstance = new Bark();
        expect(() => barkInstance.checkResult(result)).to.not.throw();
    });

    it("should throw error for invalid result without status", function () {
        const result = {};
        const barkInstance = new Bark();
        expect(() => barkInstance.checkResult(result)).to.throw(
            "Bark notification failed with invalid response!"
        );
    });

    it("should throw error for invalid result with non-2xx status", function () {
        const result = { status: 400 };
        const barkInstance = new Bark();
        expect(() => barkInstance.checkResult(result)).to.throw(
            "Bark notification failed with status code 400"
        );
    });

    // Test Branch Coverage
    it("should cover all branches in bark", function () {
        var expectedCoverage = {
            additionalParameters1: true,
            additionalParameters2: true,
            additionalParameters3: true,
            additionalParameters4: true,
            additionalParameters5: true,
            checkResult1: true,
            checkResult2: true,
            checkResult3: true,
        };

        expect(coverage).deep.equal(expectedCoverage);
    });
});
