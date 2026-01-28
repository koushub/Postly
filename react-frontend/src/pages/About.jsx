import React from "react";
import {
  Github,
  Linkedin,
  Mail,
  Globe,
  Code,
  Database,
  ShieldCheck,
} from "lucide-react";
import { useThemeStore } from "../store/themeStore";

const About = () => {
  const { theme } = useThemeStore();

  return (
    <div className="min-h-screen px-6 py-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          About <span className="text-primary">Postly</span>
        </h1>
        <p className="text-base-content/70 text-xl max-w-2xl mx-auto">
          A modern social blogging platform built to share ideas, stories, and
          thoughts with the world.
        </p>
      </div>

      {/* Project Description */}
      <div className="card bg-base-100 shadow-xl border border-base-200 mb-10">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-2">
            📝 What is Postly?
          </h2>
          <p className="text-base-content/80 leading-relaxed">
            Postly is a full-stack social blogging web application that allows
            users to create, share, and explore posts across various categories.
            It is built using a modern RESTful architecture with Spring Boot
            powering the backend, React handling the frontend, and MySQL serving
            as the relational database.
          </p>
          <p className="text-base-content/80 leading-relaxed mt-3">
            The project focuses on scalability, clean code structure, and secure
            authentication using JWT — reflecting real-world production-level
            development practices.
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card bg-base-100 shadow-lg border border-base-200">
          <div className="card-body items-center text-center">
            <Code size={32} className="text-primary mb-3" />
            <h3 className="font-bold text-lg">Frontend</h3>
            <p className="text-base-content/70">
              React • Zustand • TailwindCSS • DaisyUI • Axios
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg border border-base-200">
          <div className="card-body items-center text-center">
            <Database size={32} className="text-primary mb-3" />
            <h3 className="font-bold text-lg">Backend</h3>
            <p className="text-base-content/70">
              Spring Boot • Spring Security • JWT • JPA • Hibernate • MySQL
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg border border-base-200">
          <div className="card-body items-center text-center">
            <ShieldCheck size={32} className="text-primary mb-3" />
            <h3 className="font-bold text-lg">Architecture</h3>
            <p className="text-base-content/70">
              REST APIs • Layered Design • DTO Pattern • Role-based Auth
            </p>
          </div>
        </div>
      </div>

      {/* Purpose */}
      <div className="card bg-base-100 shadow-xl border border-base-200 mb-12">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-2">
            🎯 Project Purpose
          </h2>
          <p className="text-base-content/80 leading-relaxed">
            This project was developed as part of the CDAC curriculum to
            demonstrate:
          </p>
          <ul className="list-disc list-inside mt-3 text-base-content/80 space-y-1">
            <li>Full-stack Web Development</li>
            <li>REST API Design using Spring Boot</li>
            <li>Secure Authentication with JWT</li>
            <li>Frontend Integration with React</li>
            <li>Database Modeling & ORM with Hibernate</li>
            <li>Clean and Scalable Code Architecture</li>
          </ul>
        </div>
      </div>

      {/* Team Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-6">👨‍💻 The Developers</h2>

        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* Developer Card */}
          <div className="card bg-base-100 shadow-lg border border-base-200 w-full md:w-1/2">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder mb-3">
                <div
                  className="bg-primary text-primary-content 
    rounded-full 
    w-24 h-24 
    flex items-center justify-center
    text-4xl font-bold
    ring ring-primary ring-offset-base-100 ring-offset-2
    overflow-hidden"
                >
                  K
                </div>
              </div>
              <h3 className="font-bold text-xl">Koushubh Yadav</h3>
              <p className="text-base-content/60">Full Stack Developer</p>

              <div className="flex gap-4 mt-4">
                <a
                  href="https://github.com/koushub"
                  target="_blank"
                  className="btn btn-circle btn-ghost"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/koushubh-yadav/"
                  target="_blank"
                  className="btn btn-circle btn-ghost"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="mailto:koushubhy2k@gmail.com"
                  className="btn btn-circle btn-ghost"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
          {/* Developer Card */}
          <div className="card bg-base-100 shadow-lg border border-base-200 w-full md:w-1/2">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder mb-3">
                <div
                  className="bg-primary text-primary-content 
    rounded-full 
    w-24 h-24 
    flex items-center justify-center
    text-4xl font-bold
    ring ring-primary ring-offset-base-100 ring-offset-2
    overflow-hidden"
                >
                  S
                </div>
              </div>
              <h3 className="font-bold text-xl">Shantanu Sonune</h3>
              <p className="text-base-content/60">Document & Testing</p>

              <div className="flex gap-4 mt-4">
                <a
                  href="https://github.com/koushub"
                  target="_blank"
                  className="btn btn-circle btn-ghost"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/koushubh-yadav/"
                  target="_blank"
                  className="btn btn-circle btn-ghost"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="mailto:koushubhy2k@gmail.com"
                  className="btn btn-circle btn-ghost"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-center text-base-content/60 mt-10">
        Built with ❤️ using Spring Boot & React
      </p>
    </div>
  );
};

export default About;
