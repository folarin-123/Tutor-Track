import { ArrowRight, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell, RoleSelector } from "./SignInPage.jsx";
import { useTheme } from "../../hooks/useTheme.js";

const roleCopy = {
  tutor: {
    title: "Set up your tutor space",
    description: "Create a simple home for your students, sessions, and progress.",
    fields: [
      ["name", "Your name", "text", "Mr. Adewale"],
      ["subjects", "Subjects taught", "text", "Mathematics, Physics"],
      ["exam", "Exam focus", "select", "Choose an exam focus"],
      ["contact", "Phone or email", "text", "+234 803 555 0192"],
    ],
  },
  student: {
    title: "Join your learning space",
    description: "Use the invite from your tutor to keep your plan and assignments close.",
    fields: [
      ["name", "Your name", "text", "Blessing Okafor"],
      ["exam", "Exam target", "select", "Choose an exam target"],
      ["school", "School", "text", "Your school"],
      ["invite", "Invite code", "text", "TUTR-4821"],
    ],
  },
  parent: {
    title: "See your child's progress",
    description: "Join the linked parent view for sessions, assignments, and payments.",
    fields: [
      ["name", "Your name", "text", "Mrs. Nwachukwu"],
      ["contact", "Phone or email", "text", "+234 803 555 0192"],
      ["invite", "Invite code", "text", "TUTR-4821"],
    ],
  },
};

export default function SignUpPage() {
  const [role, setRole] = useState("tutor");
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const content = roleCopy[role];

  return (
    <AuthShell eyebrow="Get started" dark={dark} onToggleTheme={toggleTheme}>
      <RoleSelector role={role} onChange={setRole} />
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight">{content.title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{content.description} This is a visual prototype, so nothing is saved.</p>
      <div className="mt-7 space-y-4">
        {content.fields.map(([id, label, type, placeholder]) => <Field key={id} id={id} label={label} type={type} placeholder={placeholder} />)}
      </div>
      <button type="button" onClick={() => navigate(`/${role}`)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 font-bold text-white">Create account <ArrowRight size={17} /></button>
      <p className="mt-6 text-center text-sm text-slate-500">Already have a space? <Link to="/signin" className="font-bold text-emerald-600">Sign in</Link></p>
    </AuthShell>
  );
}

function Field({ id, label, type, placeholder }) {
  if (type === "select") {
    return (
      <label className="block text-sm font-bold" htmlFor={id}>
        {label}
        <select id={id} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-emerald-500 dark:border-slate-700 dark:bg-slate-900">
          <option>{placeholder}</option>
          <option>WAEC</option>
          <option>JAMB</option>
          <option>NECO</option>
        </select>
      </label>
    );
  }

  const isContact = id === "contact";
  return (
    <label className="block text-sm font-bold" htmlFor={id}>
      {label}
      <div className="relative mt-2">
        {isContact && (placeholder.startsWith("+") ? <Phone className="absolute left-3 top-3.5 text-slate-400" size={17} /> : <Mail className="absolute left-3 top-3.5 text-slate-400" size={17} />)}
        <input id={id} type={isContact && placeholder.startsWith("+") ? "tel" : "text"} placeholder={placeholder} className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-emerald-500 dark:border-slate-700 dark:bg-slate-900 ${isContact ? "pl-10" : ""}`} />
      </div>
    </label>
  );
}
