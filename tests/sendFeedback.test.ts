import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

const feedbackSchema = z.object({
	message: z.string().min(1).max(5000),
});

const mockSend = vi.fn();

vi.mock("resend", () => ({
	Resend: vi.fn().mockImplementation(() => ({
		emails: { send: mockSend },
	})),
}));

vi.mock("~/env", () => ({
	env: { RESEND_API_KEY: "test-key" },
}));

vi.mock("@tanstack/react-start", () => ({
	createServerFn: (_opts: { method: string }) => {
		let validator: z.ZodSchema | undefined;
		const builder = {
			inputValidator: (schema: z.ZodSchema) => {
				validator = schema;
				return builder;
			},
			handler: (fn: (opts: { data: unknown }) => unknown) => {
				return async (opts: { data: unknown }) => {
					const data = validator ? validator.parse(opts.data) : opts.data;
					return fn({ data });
				};
			},
		};
		return builder;
	},
}));

describe("sendFeedback", () => {
	describe("validation", () => {
		it("accepts a valid message", () => {
			const result = feedbackSchema.safeParse({ message: "Great map!" });
			expect(result.success).toBe(true);
		});

		it("rejects an empty message", () => {
			const result = feedbackSchema.safeParse({ message: "" });
			expect(result.success).toBe(false);
		});

		it("rejects a missing message", () => {
			const result = feedbackSchema.safeParse({});
			expect(result.success).toBe(false);
		});

		it("rejects a message over 5000 characters", () => {
			const result = feedbackSchema.safeParse({ message: "a".repeat(5001) });
			expect(result.success).toBe(false);
		});

		it("accepts a message at exactly 5000 characters", () => {
			const result = feedbackSchema.safeParse({ message: "a".repeat(5000) });
			expect(result.success).toBe(true);
		});
	});

	describe("email sending", () => {
		it("sends an email via Resend on success", async () => {
			mockSend.mockResolvedValueOnce({ error: null });
			const { sendFeedback } = await import("~/data/sendFeedback");

			const result = await sendFeedback({ data: { message: "Test feedback" } });

			expect(result).toEqual({ success: true });
			expect(mockSend).toHaveBeenCalledWith({
				from: "Latamap Feedback <noreply@feedback.latamap.com>",
				to: "caleblovell1@gmail.com",
				subject: "Latamap Feedback",
				text: "Test feedback",
			});
		});

		it("throws when Resend returns an error", async () => {
			mockSend.mockResolvedValueOnce({
				error: { message: "API error" },
			});
			const { sendFeedback } = await import("~/data/sendFeedback");

			await expect(
				sendFeedback({ data: { message: "Test feedback" } }),
			).rejects.toThrow("Failed to send feedback");
		});
	});
});
