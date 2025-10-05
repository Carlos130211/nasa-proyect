"use client";

type Socials = {
  linkedin?: string;
  instagram?: string;
  github?: string;
};

type Member = {
  name: string;
  role: string;
  school: string;
  photo?: string;
  socials?: Socials;
};

const TEAM: Member[] = [
  {
    name: "Carlos Silva Calderon",
    role: "Fronted",
    school: "USAT · Chiclayo, Perú",
    photo: "/Silva.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/silva-calderon-carlos-francisco-a9a296275",
      github: "https://github.com/Carlos130211",
    },
  },
  {
    name: "Diego Sandoval Paredes",
    role: "Data Search",
    school: "USAT · Chiclayo, Perú",
    photo: "/Sandoval.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/diego-ismael-sandoval-paredes-874a95328",
      github: "https://github.com/Diego-S4",
    },
  },
  {
    name: "Rodrigo Tocto Portocarrero",
    role: "Fronted & Apis",
    school: "USAT · Chiclayo, Perú",
    photo: "/Tocto.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/rodrigo-jes%C3%BAs-tocto-portocarrero-77a5a21ab/",
      github: "https://github.com/RodrigoToctoPortocarrero",
    },
  },
  {
    name: "Txiki Garaycochea Mendoza",
    role: "Desarrollador de IA",
    school: "USAT · Chiclayo, Perú",
    photo: "/Garaycochea.webp",
    socials: {
      linkedin: "",
      github: "https://github.com/XavierGM06",
    },
  },
  {
    name: "Daniel Saavedra Huayta",
    role: "Desarrollador de IA",
    school: "USAT · Chiclayo, Perú",
    photo: "/Saavedra.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/daniel-saavedra-937b592b2/",
      github: "https://github.com/WhichGod360",
    },
  },
  {
    name: "Gabriel Flores Coronel",
    role: "Data Search",
    school: "USAT · Chiclayo, Perú",
    photo: "/Flores.webp",
    socials: {
      linkedin: "https://www.linkedin.com/feed/?trk=onboarding-landing",
      github: "https://github.com/gabrielangel283",
    },
  },
];

export default function Integrantes() {
  return (
    <div className="w-full text-slate-900">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-6">
          Integrantes
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {TEAM.map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-black/10 bg-white p-6 sm:p-7">
          <h2 className="text-lg font-bold tracking-tight">Estado del reto</h2>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-slate-700">
            <li>Diseño Terminado</li>
            <li>Conexion con Datos Realizada</li>
            <li>Esta Demo es solo para Perú</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  const initials = getInitials(member.name);

  return (
    <article className="group flex flex-col items-center rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 text-center">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-xl font-semibold text-slate-600 mb-4">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="object-cover w-full h-full"
          />
        ) : (
          initials
        )}
      </div>
      <h3 className="text-base font-bold">{member.name}</h3>
      <p className="text-sm text-slate-600">{member.role}</p>
      <p className="text-xs text-slate-500 mt-1">{member.school}</p>
      <div className="flex gap-3 justify-center mt-3">
        {member.socials?.linkedin && (
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0B66C2]"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
        )}
        {member.socials?.instagram && (
          <a
            href={member.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E1306C]"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
        )}
        {member.socials?.github && (
          <a
            href={member.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black"
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
        )}
      </div>
    </article>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Iconos SVG minimalistas ↓
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4zM8 8h3.8v2.2h.05c.53-1 1.82-2.2 3.75-2.2 4 0 4.7 2.6 4.7 6V24h-4v-7.9c0-1.9 0-4.4-2.7-4.4-2.7 0-3.1 2.1-3.1 4.3V24h-4z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.4.4.6.2 1 .4 1.5.8s.7.9.8 1.5c.2.5.3 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.4-.2.6-.4 1-0.8 1.5s-.9.7-1.5.8c-.5.2-1.2.3-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.4-1.5-.8s-.7-.9-.8-1.5c-.2-.5-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.4.2-.6.4-1 .8-1.5s.9-.7 1.5-.8c.5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 0 5.6 0 4.8.1 4.2.2c-.9.1-1.7.4-2.5.9-.8.4-1.4 1-1.9 1.9C-.7 4 .5 4.8.2 5.7.1 6.4 0 7.2 0 8.6v6.8c0 1.4.1 2.2.2 2.9.3.9.7 1.7 1.2 2.5.5.9 1.1 1.5 1.9 1.9.8.5 1.6.8 2.5.9.6.1 1.4.2 2.8.2h6.8c1.4 0 2.2-.1 2.9-.2.9-.1 1.7-.4 2.5-.9.8-.4 1.4-1 1.9-1.9.5-.8.8-1.6.9-2.5.1-.7.2-1.5.2-2.9V8.6c0-1.4-.1-2.2-.2-2.9-.1-.9-.4-1.7-.9-2.5-.4-.8-1-1.4-1.9-1.9-.8-.5-1.6-.8-2.5-.9C16.2.1 15.4 0 14 0H8.6C7.2 0 6.4.1 5.7.2c-.9.1-1.7.4-2.5.9-.8.4-1.4 1-1.9 1.9C.7 4 .5 4.8.2 5.7.1 6.4 0 7.2 0 8.6v6.8c0 1.4.1 2.2.2 2.9.3.9.7 1.7 1.2 2.5.5.9 1.1 1.5 1.9 1.9.8.5 1.6.8 2.5.9.6.1 1.4.2 2.8.2h6.8c1.4 0 2.2-.1 2.9-.2.9-.1 1.7-.4 2.5-.9.8-.4 1.4-1 1.9-1.9.5-.8.8-1.6.9-2.5.1-.7.2-1.5.2-2.9V8.6c0-1.4-.1-2.2-.2-2.9-.1-.9-.4-1.7-.9-2.5-.4-.8-1-1.4-1.9-1.9-.8-.5-1.6-.8-2.5-.9C15.3.1 14.5 0 13.1 0H8.6z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 0a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.5-4-1.5-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1.7 2.1 3.5 1.5 0-.8.3-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.1-3.2 0-.3-.5-1.3.1-2.8 0 0 .9-.3 3.1 1.1a10.5 10.5 0 0 1 5.7 0c2.2-1.4 3.1-1.1 3.1-1.1.6 1.5.1 2.5.1 2.8.7.9 1.1 1.9 1.1 3.2 0 4.5-2.7 5.5-5.3 5.8.4.3.8 1 .8 2v3c0 .3.2.6.8.5A12 12 0 0 0 12 0z" />
    </svg>
  );
}
