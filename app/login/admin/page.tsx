import { Metadata } from "next";
import AdminLoginComponent from "./AdminLoginComponent";

export const metadata: Metadata = {
  title: "Greatomatic Admin Login",
  description: "Secure login portal for administrators to manage branches, vacancies, appointments, users, and company information.",
};
export default function AdminLogin() {
  return (
    <AdminLoginComponent />
  )
}
