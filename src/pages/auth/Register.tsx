import FormRegister from "@/components/register/Form";
import backgroundImage from "@/assets/images/background-register.webp";

export default function RegisterPage() {
  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <FormRegister />
    </section>
  );
}
