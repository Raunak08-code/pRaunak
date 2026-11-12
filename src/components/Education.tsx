import { resumeData } from "../data";
import Skills from "./Skills";

export default function Education() {
  return (
    <section id="education" className="edu-skill-page">
      <div className="edu-skill-layout">
        <div className="education-column">
          <p className="edu-skill-kicker">Academic background</p>
          <h2>EDUCATION</h2>
          <div className="education-orbit">
            {resumeData.education.map((education, index) => (
              <article
                key={education.degree}
                className={`education-oval education-oval-${index + 1}`}
              >
                <span className="education-year">{education.year}</span>
                <h3>{education.degree}</h3>
                <p>{education.institution}</p>
                <strong>{education.score}</strong>
              </article>
            ))}
          </div>
        </div>
        <Skills />
      </div>
    </section>
  );
}
