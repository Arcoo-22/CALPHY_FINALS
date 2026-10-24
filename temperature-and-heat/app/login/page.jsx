import { Container } from "react-bootstrap";
import AuthForm from "@/components/AuthForm";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Log in",
  description: "Log in to sync your CalphyLearn progress to the database.",
};

export default function LoginPage() {
  return (
    <div className="page-top-space">
      <section className="section-tight pb-5">
        <Container>
          <Reveal>
            <AuthForm mode="login" />
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
