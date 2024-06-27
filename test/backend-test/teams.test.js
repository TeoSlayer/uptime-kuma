describe('Teams', function () {
    let Teams;
    let teams;
    let coverage;
    let axiosPostStub;
    const { DOWN, UP } = require("../../src/util");

    before(async function () {
        this.timeout(10000);
        const chai = (await import("chai"));
        expect = chai.expect;
        sinon = (await import("sinon")).default;
        axios = (await import ("axios")).default;
        TeamsModule = (await import ("../../server/notification-providers/teams.js"));
        Teams = TeamsModule.Teams;
        coverage = TeamsModule.coverage;
    });

    beforeEach(function () {
        teams = new Teams();
        axiosPostStub = sinon.stub(axios, "post").resolves();
    });

    afterEach(function () {
        sinon.restore();
    });

    describe('_statusMessageFactory', function () {
        it('should create a status message with correct content when status is DOWN', function () {
            const status = DOWN;
            const message = 'Monitor 1';
            const withStatusSymbol = false;

            const result = teams._statusMessageFactory(status, message, withStatusSymbol);

            expect(result).to.be.a('string');
            expect(result).to.include('[Monitor 1] went down');
        });

        it('should create a status message with correct content when status is UP', function () {
            const status = UP;
            const message = 'Monitor 2';
            const withStatusSymbol = false;

            const result = teams._statusMessageFactory(status, message, withStatusSymbol);

            expect(result).to.be.a('string');
            expect(result).to.include('[Monitor 2] is back online');
        });

        it('should return a default message when status is neither DOWN nor UP', function () {
            const status = 'UNKNOWN';
            const message = 'Monitor 3';
            const withStatusSymbol = true;

            const result = teams._statusMessageFactory(status, message, withStatusSymbol);

            expect(result).to.be.a('string');
            expect(result).to.equal('Notification');
        });
    });

    describe('_getStyle', function () {
        it('should return "attention" style when status is DOWN', function () {
            const status = DOWN;

            const result = teams._getStyle(status);

            expect(result).to.be.a('string');
            expect(result).to.equal('attention');
        });

        it('should return "good" style when status is UP', function () {
            const status = UP;

            const result = teams._getStyle(status);

            expect(result).to.be.a('string');
            expect(result).to.equal('good');
        });

        it('should return "emphasis" style when status is neither DOWN nor UP', function () {
            const status = 'UNKNOWN';

            const result = teams._getStyle(status);

            expect(result).to.be.a('string');
            expect(result).to.equal('emphasis');
        });

            // Test Branch Coverage
    it("should cover all branches in _statusMessageFactory and _getStyle", function () {
        var expectedCoverage = {
            statusMessageFactory: {
                status1: true,
                status2: true,
                status3: true,
            },
            getStyle: {
                style1: true,
                style2: true,
                style3: true,
            }
        };

        expect(coverage).deep.equal(expectedCoverage);
    });

    });
});
