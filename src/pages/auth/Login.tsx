import FormLogin from "@/components/login/Form";
import backgroundImage from "@/assets/images/background-login.png";

export default function Login() {
  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <FormLogin />
    </section>
  );
}
