import { builder } from '../../builder.js';
import { transporter } from '../../utils/smtp.js';

builder.mutationFields((t) => ({
    sendTestEmail: t.field({
        type: 'String',
        authScopes: {
            anonymousRequest: true,
        },
        args: {
            to: t.arg.string({ required: true }),
            subject: t.arg.string({ required: true }),
        },
        async resolve(_root, args, _ctx) {
            await transporter.sendMail({
                from: '"DSTK" <noreply@dstk.org>',
                to: args.to,
                subject: args.subject,
                text: 'This is a test email!',
                html: '<p>This is a <strong>test email</strong>!</p>',
            });

            return `Email sent to ${args.to}`;
        },
    }),
}));
