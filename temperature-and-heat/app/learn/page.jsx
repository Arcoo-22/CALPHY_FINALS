import { Container } from "react-bootstrap";
import LearnHome from "@/components/LearnHome";

export const metadata = {
  title: "Learn",
  description:
    "Pick up where you left off: nine lessons on temperature and heat in four units.",
};

export default function LearnPage() {
  return (
    <div className="page-top-space">
      <section className="section-tight pb-5">
        <Container>
          <LearnHome />
        </Container>
      </section>
    </div>
  );
}
