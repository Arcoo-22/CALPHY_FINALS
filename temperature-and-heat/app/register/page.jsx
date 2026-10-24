import { Container } from "react-bootstrap";
import AuthForm from "@/components/AuthForm";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Register",
  description:
    "Create a CalphyLearn account and save your quiz scores to PostgreSQL.",
};

export default function RegisterPage() {
  return (
    <div className="page-top-space">
      <section className="section-tight pb-5">
        <Container>
          <Reveal>
            <AuthForm mode="register" />
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
