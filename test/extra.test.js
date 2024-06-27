const tcpp = require("tcp-ping");
const pinglib = require("@louislam/ping");
const {
    tcping,
    ping,
    pingAsync,
    printCoverage,
    coverage,
} = require("../server/util-server"); // Replace with your actual path

jest.mock("tcp-ping"); // Mock tcpp
jest.mock("@louislam/ping"); // Mock the ping module

describe("tcping function", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should resolve with rounded max time for a successful ping", async () => {
        tcpp.ping.mockImplementation((options, callback) => {
            callback(null, { max: 123.45, results: [{ success: true }] });
        });

        const result = await tcping("example.com", 80);
        expect(result).toBe(123);
        expect(tcpp.ping).toHaveBeenCalledWith(
            expect.objectContaining({ address: "example.com", port: 80 }),
            expect.any(Function)
        );
    });

    it("should reject with an error if tcpp.ping fails", async () => {
        tcpp.ping.mockImplementation((options, callback) => {
            callback(new Error("Connection timeout"));
        });

        await expect(tcping("example.com", 80)).rejects.toThrow(
            "Connection timeout"
        );
    });

    it("should reject with an error if the ping result has an error", async () => {
        const errorMessage = "Port unreachable";
        tcpp.ping.mockImplementation((options, callback) => {
            callback(null, {
                max: 0,
                results: [{ err: new Error(errorMessage) }],
            });
        });

        await expect(tcping("example.com", 80)).rejects.toThrow(errorMessage);
    });

    it("should resolve with 0 if there are no ping results", async () => {
        tcpp.ping.mockImplementation((options, callback) => {
            callback(null, { max: 0, results: [] });
        });

        const result = await tcping("example.com", 80);
        expect(result).toBe(0); // Expect 0 for empty results as per your implementation
    });
});

describe("ping functions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("pingAsync", () => {
        it("should resolve with time for a successful ping", async () => {
            pinglib.promise.probe.mockResolvedValue({
                alive: true,
                time: 150,
            });
            const result = await pingAsync("example.com");
            expect(result).toBe(150);
        });

        it("should reject with an error for a failed ping (non-Windows)", async () => {
            pinglib.promise.probe.mockResolvedValue({
                alive: false,
                output: "Request timeout for icmp_seq 0",
            });
            await expect(pingAsync("example.com")).rejects.toThrow(
                "Request timeout for icmp_seq 0"
            );
        });

        it("should reject with a converted UTF-8 error for a failed ping (Windows)", async () => {
            const encodedErrorMessage =
                "Some Windows error message in non-UTF8 encoding";

            pinglib.promise.probe.mockResolvedValue({
                alive: false,
                output: Buffer.from(encodedErrorMessage, "latin1"), // Simulate non-UTF8
            });

            // Ensure convertToUTF8 correctly converts the error
            exports.convertToUTF8 = jest.fn((buffer) =>
                buffer.toString("utf-8")
            );

            await expect(pingAsync("example.com")).rejects.toThrow(
                encodedErrorMessage
            ); // Expect the decoded error message
        });
    });

    describe("ping", () => {
        it("should resolve with time for a successful ping", async () => {
            pinglib.promise.probe.mockResolvedValue({
                alive: true,
                time: 85,
            });
            const result = await ping("example.com");
            expect(result).toBe(85);
        });

        it("should try IPv6 if initial ping fails with an empty error message", async () => {
            pinglib.promise.probe
                .mockRejectedValueOnce(new Error("")) // First call fails silently
                .mockResolvedValueOnce({ alive: true, time: 92 }); // Second succeeds
            const result = await ping("example.com");
            expect(result).toBe(92);
            expect(pinglib.promise.probe).toHaveBeenCalledTimes(2);
            expect(pinglib.promise.probe).toHaveBeenLastCalledWith(
                "example.com",
                { deadline: 10, min_reply: 1, packetSize: 56, v6: true }
            );
        });

        it("should reject if both IPv4 and IPv6 pings fail", async () => {
            pinglib.promise.probe
                .mockRejectedValueOnce(new Error("Some error")) // IPv4 fails
                .mockRejectedValueOnce(new Error("Another error")); // IPv6 fails
            await expect(ping("example.com")).rejects.toThrow("Some error");
        });
    });

    it("should cover all branches in ping", async () => {
        console.log("Coverage:", coverage);

        const expectedCoverage = {
            ping: {
                ipv4Success: true,
                ipv4Failure: true,
                ipv6Success: true,
                ipv6Failure: true,
            },
        };

        expect(coverage).toEqual(expectedCoverage); // Compare with the expected coverage
    });
});
