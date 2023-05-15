import { createTransport, SendMailOptions } from "nodemailer";
import { env } from "~/env.mjs";
import { render } from "@react-email/components";
import { SendInvoiceEmail } from "./emails/SendInvoice";

export const transport = createTransport({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

type SendInvoiceParams = {
  key: string;
  companyName: string;
  emailFrom: string;
  emailTo: string;
};

export const sendInvoiceEmail = ({
  key,
  companyName,
  emailFrom,
  emailTo,
}: SendInvoiceParams) => {
  const html = render(
    <SendInvoiceEmail companyName={companyName} invoiceKey={key} />
  );

  const options: SendMailOptions = {
    from: emailFrom,
    to: emailTo,
    subject: `Invoice from ${companyName}`,
    html,
  };

  transport.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
