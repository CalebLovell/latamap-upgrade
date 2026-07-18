import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "~/env";

const feedbackSchema = z.object({
	message: z.string().min(1).max(5000),
	email: z.email().max(320).optional().or(z.literal("")),
});

export const sendFeedback = createServerFn({
	method: "POST",
})
	.inputValidator(feedbackSchema)
	.handler(async ({ data }) => {
		const resend = new Resend(env.RESEND_API_KEY);

		const text = data.email
			? `${data.message}\n\nFrom: ${data.email}`
			: data.message;

		const { error } = await resend.emails.send({
			from: "Latamap Feedback <noreply@feedback.latamap.com>",
			to: "caleblovell1@gmail.com",
			replyTo: data.email || undefined,
			subject: "Latamap Feedback",
			text,
		});

		if (error) {
			throw new Error("Failed to send feedback");
		}

		return { success: true };
	});
