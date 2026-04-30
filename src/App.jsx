import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Copy, Download, CheckCircle, UserCircle, Settings, Box, BarChart2, Share2, Link as LinkIcon, Edit3 } from 'lucide-react';
import { generateProfileReadme } from './Template';

const SKILL_CATEGORIES = [
  {
    category: "Programming Languages",
    id: "programming",
    skills: [
      { id: "c", name: "C", icon: "c-original.svg" },
      { id: "cplusplus", name: "C++", icon: "cplusplus-original.svg" },
      { id: "csharp", name: "C#", icon: "csharp-original.svg" },
      { id: "go", name: "Go", icon: "go-original.svg" },
      { id: "java", name: "Java", icon: "java-original.svg" },
      { id: "javascript", name: "JavaScript", icon: "javascript-original.svg" },
      { id: "typescript", name: "TypeScript", icon: "typescript-original.svg" },
      { id: "php", name: "PHP", icon: "php-original.svg" },
      { id: "python", name: "Python", icon: "python-original.svg" },
      { id: "ruby", name: "Ruby", icon: "ruby-original.svg" },
      { id: "rust", name: "Rust", icon: "rust-plain.svg" },
      { id: "swift", name: "Swift", icon: "swift-original.svg" },
      { id: "kotlin", name: "Kotlin", icon: "kotlin-original.svg" },
      { id: "dart", name: "Dart", icon: "dart-original.svg" }
    ]
  },
  {
    category: "Frontend Development",
    id: "frontend",
    skills: [
      { id: "html5", name: "HTML5", icon: "html5-original.svg" },
      { id: "css3", name: "CSS3", icon: "css3-original.svg" },
      { id: "react", name: "React", icon: "react-original.svg" },
      { id: "vuejs", name: "Vue.js", icon: "vuejs-original.svg" },
      { id: "angularjs", name: "Angular", icon: "angularjs-original.svg" },
      { id: "nextjs", name: "Next.js", icon: "nextjs-original.svg" },
      { id: "svelte", name: "Svelte", icon: "svelte-original.svg" },
      { id: "tailwindcss", name: "Tailwind CSS", icon: "tailwindcss-original.svg" },
      { id: "bootstrap", name: "Bootstrap", icon: "bootstrap-original.svg" },
      { id: "materialui", name: "Material UI", icon: "materialui-original.svg" },
      { id: "redux", name: "Redux", icon: "redux-original.svg" },
      { id: "webpack", name: "Webpack", icon: "webpack-original.svg" },
      { id: "babel", name: "Babel", icon: "babel-original.svg" }
    ]
  },
  {
    category: "Backend Development",
    id: "backend",
    skills: [
      { id: "nodejs", name: "Node.js", icon: "nodejs-original.svg" },
      { id: "express", name: "Express", icon: "express-original.svg" },
      { id: "django", name: "Django", icon: "django-plain.svg" },
      { id: "flask", name: "Flask", icon: "flask-original.svg" },
      { id: "spring", name: "Spring", icon: "spring-original.svg" },
      { id: "laravel", name: "Laravel", icon: "laravel-original.svg" },
      { id: "graphql", name: "GraphQL", icon: "graphql-plain.svg" }
    ]
  },
  {
    category: "Database",
    id: "database",
    skills: [
      { id: "mysql", name: "MySQL", icon: "mysql-original.svg" },
      { id: "postgresql", name: "PostgreSQL", icon: "postgresql-original.svg" },
      { id: "mongodb", name: "MongoDB", icon: "mongodb-original.svg" },
      { id: "redis", name: "Redis", icon: "redis-original.svg" },
      { id: "sqlite", name: "SQLite", icon: "sqlite-original.svg" },
      { id: "firebase", name: "Firebase", icon: "firebase-plain.svg" },
      { id: "supabase", name: "Supabase", icon: "supabase-plain.svg" }
    ]
  },
  {
    category: "DevOps & Tools",
    id: "devops",
    skills: [
      { id: "git", name: "Git", icon: "git-original.svg" },
      { id: "github", name: "GitHub", icon: "github-original.svg" },
      { id: "gitlab", name: "GitLab", icon: "gitlab-original.svg" },
      { id: "docker", name: "Docker", icon: "docker-original.svg" },
      { id: "kubernetes", name: "Kubernetes", icon: "kubernetes-original.svg" },
      { id: "amazonwebservices", name: "AWS", icon: "amazonwebservices-original-wordmark.svg" },
      { id: "googlecloud", name: "GCP", icon: "googlecloud-original.svg" },
      { id: "azure", name: "Azure", icon: "azure-original.svg" },
      { id: "linux", name: "Linux", icon: "linux-original.svg" },
      { id: "jenkins", name: "Jenkins", icon: "jenkins-line.svg" },
      { id: "figma", name: "Figma", icon: "figma-original.svg" }
    ]
  }
];

const SOCIAL_OPTIONS = [
  { id: 'github', label: 'GitHub', icon: 'https://cdn.simpleicons.org/github/white' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'https://cdn.simpleicons.org/linkedin/0A66C2' },
  { id: 'twitter', label: 'Twitter', icon: 'https://cdn.simpleicons.org/twitter/1DA1F2' },
  { id: 'devto', label: 'Dev.to', icon: 'https://cdn.simpleicons.org/devdotto/white' },
  { id: 'hashnode', label: 'Hashnode', icon: 'https://cdn.simpleicons.org/hashnode/2962FF' },
  { id: 'medium', label: 'Medium', icon: 'https://cdn.simpleicons.org/medium/white' },
  { id: 'youtube', label: 'YouTube', icon: 'https://cdn.simpleicons.org/youtube/FF0000' },
  { id: 'stackoverflow', label: 'StackOverflow', icon: 'https://cdn.simpleicons.org/stackoverflow/F58025' },
  { id: 'instagram', label: 'Instagram', icon: 'https://cdn.simpleicons.org/instagram/E4405F' },
  { id: 'dribbble', label: 'Dribbble', icon: 'https://cdn.simpleicons.org/dribbble/EA4C89' },
  { id: 'behance', label: 'Behance', icon: 'https://cdn.simpleicons.org/behance/1769FF' },
  { id: 'leetcode', label: 'LeetCode', icon: 'https://cdn.simpleicons.org/leetcode/FFA116' },
  { id: 'discord', label: 'Discord', icon: 'https://cdn.simpleicons.org/discord/5865F2' },
];

function App() {
  const [state, setState] = useState({
    name: 'karmaboy1309',
    subtitle: 'Architecting scalable web applications & engineering open-source solutions 🚀',
    aboutMe: [
      { id: 'work', prefix: '🔭 I’m currently working on', value: 'building high-performance developer tools and robust full-stack architectures', link: 'https://github.com/karmaboy1309', hasLink: true },
      { id: 'collab', prefix: '👯 I’m looking to collaborate on', value: 'innovative open-source projects and large-scale distributed systems', link: '', hasLink: true },
      { id: 'help', prefix: '🤝 I’m looking for help with', value: 'exploring bleeding-edge AI integrations and advanced frontend optimizations', link: '', hasLink: true },
      { id: 'learn', prefix: '🌱 I’m currently learning', value: 'Cloud-native patterns, Web3 concepts, and advanced TypeScript paradigms', link: '', hasLink: false },
      { id: 'ask', prefix: '💬 Ask me about', value: 'Modern frontend ecosystems, React/Next.js, Node.js, and crafting exceptional UX', link: '', hasLink: false },
      { id: 'reach', prefix: '📫 How to reach me', value: 'Ping me on Twitter or LinkedIn for collaborations!', link: '', hasLink: false },
      { id: 'projects', prefix: '👨‍💻 All of my projects are available at', value: 'my GitHub portfolio', link: 'https://github.com/karmaboy1309', hasLink: true },
      { id: 'articles', prefix: '📝 I regularly write articles on', value: 'software engineering best practices and the latest tech trends', link: '', hasLink: true },
      { id: 'resume', prefix: '📄 Know about my experiences', value: 'my interactive resume', link: '#', hasLink: true },
      { id: 'fun', prefix: '⚡ Fun fact', value: 'I treat debugging like solving a murder mystery, and I am the lead detective 🕵️‍♂️', link: '', hasLink: false },
    ],
    socials: {
      github: 'karmaboy1309', linkedin: 'karmaboy1309', twitter: 'karmaboy1309', devto: '', hashnode: '', medium: '', youtube: '', stackoverflow: '', instagram: '', dribbble: '', behance: '', leetcode: '', discord: ''
    },
    skills: {
      programming: [], frontend: [], backend: [], database: [], devops: []
    },
    addons: {
      githubStats: true,
      githubStatsTheme: "dark",
      topLangs: true,
      streakStats: true,
      visitorsBadge: true,
    }
  });

  const [copied, setCopied] = useState(false);

  const markdownContent = useMemo(() => generateProfileReadme(state), [state]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const handleAboutChange = (id, field, value) => {
    setState(prev => ({
      ...prev,
      aboutMe: prev.aboutMe.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      socials: { ...prev.socials, [name]: value }
    }));
  };

  const handleAddonChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState(prev => ({
      ...prev,
      addons: { ...prev.addons, [name]: type === 'checkbox' ? checked : value }
    }));
  };

  const toggleSkill = (categoryId, skill) => {
    setState(prev => {
      const categorySkills = prev.skills[categoryId];
      const isSelected = categorySkills.some(s => s.id === skill.id);

      return {
        ...prev,
        skills: {
          ...prev.skills,
          [categoryId]: isSelected
            ? categorySkills.filter(s => s.id !== skill.id)
            : [...categorySkills, skill]
        }
      };
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[#0b0f19]">

      {/* LEFT PANE: Editor */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto border-r border-white/10 p-6 glass-panel custom-scrollbar">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
          <UserCircle className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            GitHub Profile Readme Generator
          </h1>
        </div>

        <div className="space-y-10 pb-20">
          {/* Title Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
              <Settings className="w-5 h-5 text-gray-400" /> Title & Subtitle
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Hi 👋, I'm</label>
                <input type="text" name="name" value={state.name} onChange={handleBasicChange} placeholder="John Doe" className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                <input type="text" name="subtitle" value={state.subtitle} onChange={handleBasicChange} placeholder="A passionate frontend developer from India" className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none transition-colors" />
              </div>
            </div>
          </section>

          {/* About Me Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
              <Edit3 className="w-5 h-5 text-gray-400" /> About Me
            </h2>
            <div className="space-y-3">
              {state.aboutMe.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 whitespace-nowrap w-48 truncate" title={item.prefix}>{item.prefix}</span>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleAboutChange(item.id, 'value', e.target.value)}
                    placeholder="project/topic"
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg p-2 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                  />
                  {item.hasLink && (
                    <input
                      type="text"
                      value={item.link}
                      onChange={(e) => handleAboutChange(item.id, 'link', e.target.value)}
                      placeholder="https://..."
                      className="w-1/3 bg-black/30 border border-white/10 rounded-lg p-2 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
              <Box className="w-5 h-5 text-gray-400" /> Skills
            </h2>

            {SKILL_CATEGORIES.map(category => (
              <div key={category.id} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">{category.category}</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
                  {category.skills.map(tech => {
                    const isSelected = state.skills[category.id].some(s => s.id === tech.id);
                    return (
                      <button
                        key={tech.id}
                        onClick={() => toggleSkill(category.id, tech)}
                        title={tech.name}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-300 ${isSelected ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'border-white/10 bg-black/30 hover:border-white/30'}`}
                      >
                        <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.id}/${tech.icon}`} alt={tech.name} className="w-6 h-6 mb-1" />
                        <span className="text-[10px] text-gray-300 truncate w-full text-center">{tech.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>

          {/* Socials Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
              <Share2 className="w-5 h-5 text-gray-400" /> Social Links
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SOCIAL_OPTIONS.map(social => (
                <div key={social.id} className="flex flex-col p-3 rounded-xl border border-white/10 bg-black/30 hover:border-white/20 transition-all group">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <img src={social.icon} alt={social.label} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-gray-300">{social.label}</span>
                  </div>
                  <input
                    type="text"
                    name={social.id}
                    value={state.socials[social.id]}
                    onChange={handleSocialChange}
                    placeholder="username"
                    className="w-full px-2 py-1.5 bg-black/40 border border-white/5 rounded focus:border-blue-500 focus:outline-none transition-colors text-xs text-center"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Add-ons Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
              <BarChart2 className="w-5 h-5 text-gray-400" /> Add-ons (Powered by Gitlyy)
            </h2>

            <div className="flex flex-col gap-3 p-4 bg-black/20 rounded-xl border border-white/5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="visitorsBadge" checked={state.addons.visitorsBadge} onChange={handleAddonChange} className="hidden" />
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${state.addons.visitorsBadge ? 'bg-blue-500 border-blue-500' : 'bg-black/30 border-white/20 group-hover:border-white/40'}`}>
                  {state.addons.visitorsBadge && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm text-gray-300">Display Visitors Count Badge</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="githubStats" checked={state.addons.githubStats} onChange={handleAddonChange} className="hidden" />
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${state.addons.githubStats ? 'bg-blue-500 border-blue-500' : 'bg-black/30 border-white/20 group-hover:border-white/40'}`}>
                  {state.addons.githubStats && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm text-gray-300">Display GitHub Profile Stats Card</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="topLangs" checked={state.addons.topLangs} onChange={handleAddonChange} className="hidden" />
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${state.addons.topLangs ? 'bg-blue-500 border-blue-500' : 'bg-black/30 border-white/20 group-hover:border-white/40'}`}>
                  {state.addons.topLangs && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm text-gray-300">Display Top Languages Card</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="streakStats" checked={state.addons.streakStats} onChange={handleAddonChange} className="hidden" />
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${state.addons.streakStats ? 'bg-blue-500 border-blue-500' : 'bg-black/30 border-white/20 group-hover:border-white/40'}`}>
                  {state.addons.streakStats && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm text-gray-300">Display GitHub Streak Card</span>
              </label>

              <div className="mt-2 pl-8">
                <label className="block text-xs text-gray-400 mb-1">Gitlyy Theme</label>
                <select name="githubStatsTheme" value={state.addons.githubStatsTheme} onChange={handleAddonChange} className="bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-gray-200 focus:outline-none">
                  <option value="dark">Dark</option>
                  <option value="synthwave">Synthwave</option>
                  <option value="radical">Radical</option>
                  <option value="tokyonight">Tokyonight</option>
                  <option value="dracula">Dracula</option>
                </select>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* RIGHT PANE: Live Preview */}
      <div className="w-full lg:w-1/2 h-screen flex flex-col relative bg-[#0d1117]">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg font-medium text-gray-200">Profile Preview</h2>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Markdown'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] text-sm font-medium"
            >
              <Download className="w-4 h-4" /> Download .md
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 markdown-preview text-[#c9d1d9] custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {markdownContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
