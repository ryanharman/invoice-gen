import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SendInvoiceEmailProps {
  companyName: string;
  invoiceKey: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const SendInvoiceEmail = ({
  companyName,
  invoiceKey,
}: SendInvoiceEmailProps) => (
  <Html>
    <Head />
    <Preview>Your invoice from {companyName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/public/rynvoice.png`}
          width="42"
          height="42"
          alt="Ryan Harman"
          style={logo}
        />
        <Heading style={heading}>
          You have received a new invoice from {companyName}
        </Heading>
        <Text style={paragraph}>
          You can find payment options and information using the link below as
          well as a PDF preview and download.
        </Text>
        <Section style={buttonContainer}>
          <Button
            pY={11}
            pX={23}
            style={button}
            href={`${baseUrl}/i/${invoiceKey}`}
          >
            View invoice
          </Button>
        </Section>
        <Text style={paragraph}>
          This link will be valid for one year post payment. If the link does
          not work, please contact the vendor directly.
        </Text>
        <Hr style={hr} />
        <Link href="https://ryanharman.dev" style={reportLink}>
          Ryan Harman
        </Link>
      </Container>
    </Body>
  </Html>
);

export default SendInvoiceEmail;

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "15px 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#020205",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};
