export function toApiResume(resume, title = "My Resume") {
  return {
    title,
    personalInfo: {
      fullName: resume.fullName || "",
      email: resume.email || "",
      phone: resume.phone || "",
      location: resume.location || "",
      summary: resume.summary || "",
    },

    education: (resume.education || []).map(
      ({ degree, institution, year, score }) => ({
        degree: degree || "",
        institution: institution || "",
        year: year || "",
        score: score || "",
      })
    ),

    skills: (resume.skills || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),

    projects: (resume.projects || []).map(
      ({ name, description, technologies, link }) => ({
        name: name || "",
        description: description || "",
        technologies: technologies || "",
        link: link || "",
      })
    ),

    experience: (resume.experience || []).map(
      ({ role, company, duration, description }) => ({
        role: role || "",
        company: company || "",
        duration: duration || "",
        description: description || "",
      })
    ),
  };
}

export function fromApiResume(apiResume) {
  const personalInfo = apiResume.personalInfo || {};

  return {
    fullName: personalInfo.fullName || "",
    email: personalInfo.email || "",
    phone: personalInfo.phone || "",
    location: personalInfo.location || "",
    summary: personalInfo.summary || "",

    education: (apiResume.education || []).map((item, index) => ({
      id: item._id || index + 1,
      degree: item.degree || "",
      institution: item.institution || "",
      year: item.year || "",
      score: item.score || "",
    })),

    skills: Array.isArray(apiResume.skills) ? apiResume.skills.join(", ") : (typeof apiResume.skills === 'string' ? apiResume.skills : ""),


    projects: (apiResume.projects || []).map((item, index) => ({
      id: item._id || index + 1,
      name: item.name || "",
      description: item.description || "",
      technologies: item.technologies || "",
      link: item.link || "",
    })),

    experience: (apiResume.experience || []).map((item, index) => ({
      id: item._id || index + 1,
      role: item.role || "",
      company: item.company || "",
      duration: item.duration || "",
      description: item.description || "",
    })),
  };
}