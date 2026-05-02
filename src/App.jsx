import React, { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Copy, Download, CheckCircle, UserCircle, Settings, Box, BarChart2, Share2, Link as LinkIcon, Edit3, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

const CARD_PREVIEWS = {
  githubStats: [
    {
      id: 'gitlyy',
      label: 'Overview (Gitlyy)',
      image: new URL('../state cards/4.jpg', import.meta.url).href
    },
    {
      id: 'ghstats',
      label: 'Ranked (Readme Stats)',
      image: new URL('../state cards/3.png', import.meta.url).href
    }
  ],
  topLangs: [
    {
      id: 'ghstats',
      label: 'Top Languages (Bars)',
      image: new URL('../state cards/2.png', import.meta.url).href
    },
    {
      id: 'summary',
      label: 'Most Used Languages',
      image: new URL('../state cards/5.jpg', import.meta.url).href
    }
  ],
  streak: [
    {
      id: 'streak-stats',
      label: 'Classic Streak',
      image: new URL('../state cards/6.jpg', import.meta.url).href
    },
    {
      id: 'gitlyy',
      label: 'Neon Streak',
      image: new URL('../state cards/7.png', import.meta.url).href
    }
  ],
  quote: {
    id: 'quote',
    label: 'Quote Card',
    image: new URL('../state cards/8.png', import.meta.url).href
  }
};

const getFallbackCardSrc = (source) => {
  if (!source) {
    return null;
  }

  try {
    const url = new URL(source);
    const username = url.searchParams.get('username') || url.searchParams.get('user');
    const theme = url.searchParams.get('theme') || 'dark';

    if (url.hostname.includes('github-readme-stats.vercel.app')) {
      if (url.pathname.includes('/api/top-langs')) {
        return `https://gitlyy.vercel.app/api/languages?username=${username}&theme=${theme}&layout=donut`;
      }
      if (url.pathname.includes('/api')) {
        return `https://gitlyy.vercel.app/api/overview?username=${username}&theme=${theme}`;
      }
    }

    if (url.hostname.includes('github-profile-summary-cards.vercel.app')) {
      return `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}`;
    }

    if (url.hostname.includes('streak-stats.demolab.com')) {
      return `https://gitlyy.vercel.app/api/streak?username=${username}&theme=${theme}`;
    }
  } catch (error) {
    return null;
  }

  return null;
};

function MarkdownImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [attempt, setAttempt] = useState(0);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setAttempt(0);
    setFailed(false);
    setUsedFallback(false);
  }, [src]);

  const fallbackSrc = getFallbackCardSrc(currentSrc);
  const cacheBustedSrc = src
    ? `${currentSrc}${currentSrc.includes('?') ? '&' : '?'}v=${attempt}`
    : currentSrc;

  if (failed) {
    return (
      <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-gray-400">
        <p className="mb-2">Image failed to load: {alt || 'Card'}</p>
        <button
          type="button"
          onClick={() => {
            setFailed(false);
            setAttempt(prev => prev + 1);
          }}
          className="inline-flex items-center rounded-md border border-white/20 px-2 py-1 text-xs text-gray-200 hover:border-white/40"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <img
      src={cacheBustedSrc}
      alt={alt}
      loading="lazy"
      className="max-w-full"
      onError={() => {
        if (!usedFallback && fallbackSrc && fallbackSrc !== currentSrc) {
          setUsedFallback(true);
          setCurrentSrc(fallbackSrc);
          setAttempt(prev => prev + 1);
          return;
        }
        setFailed(true);
      }}
    />
  );
}

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
      githubStatsProvider: "gitlyy",
      topLangs: true,
      topLangsProvider: "ghstats",
      streakStats: true,
      streakProvider: "gitlyy",
      visitorsBadge: true,
      quoteCard: false,
    }
  });

  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiError, setAiError] = useState('');
  const geminiApiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_GOOGLE_API_KEY ||
    import.meta.env.VITE_AI_API_KEY;

  const parseEnhancedData = (rawText) => {
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch (error) {
      const match = cleaned.match(/\[[\s\S]*\]/);
      if (!match) {
        throw error;
      }
      return JSON.parse(match[0]);
    }
  };

  const requestEnhancement = async (prompt) => {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      const fallbackResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!fallbackResponse.ok) {
        throw error;
      }

      const data = await fallbackResponse.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
  };

  const handleEnhanceWithAI = async () => {
    if (!geminiApiKey) {
      setAiError('AI enhance is unavailable right now.');
      return;
    }

    setIsEnhancing(true);
    setAiError('');

    try {
      const activeAboutItems = state.aboutMe.filter(item => item.value.trim() !== '');
      if (activeAboutItems.length === 0) {
        setAiError('Add some About Me details first.');
        return;
      }
      
      const prompt = `
    You are helping polish a GitHub Profile README.
    Here are the current 'About Me' entries as JSON:
    ${JSON.stringify(activeAboutItems, null, 2)}

    Rewrite ONLY the "value" fields.
    Rules:
    - Preserve the exact meaning.
    - Improve grammar, clarity, and professional tone.
    - Do NOT add new facts or extra info.

    Return only a JSON array of objects: [{"id":"...","value":"..."}].
    Do not include markdown fences or extra text.
      `.trim();

      const text = await requestEnhancement(prompt);
      const enhancedData = parseEnhancedData(text);
      if (!Array.isArray(enhancedData)) {
        throw new Error('Invalid AI response.');
      }

      setState(prev => {
        const newAboutMe = prev.aboutMe.map(item => {
          const enhancedItem = enhancedData.find(e => e.id === item.id);
          if (!enhancedItem || typeof enhancedItem.value !== 'string') {
            return item;
          }
          return { ...item, value: enhancedItem.value };
        });
        return { ...prev, aboutMe: newAboutMe };
      });
      
    } catch (error) {
      console.error(error);
      setAiError('AI enhance failed. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

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

  const handleAddonSelect = (name, value) => {
    setState(prev => ({
      ...prev,
      addons: { ...prev.addons, [name]: value }
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
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
                <Edit3 className="w-5 h-5 text-gray-400" /> About Me
              </h2>
            </div>
            
            {/* AI Enhancement Box */}
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleEnhanceWithAI}
                  disabled={isEnhancing}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
                </button>
              </div>
              {aiError && <p className="text-red-400 text-xs">{aiError}</p>}
            </div>

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

              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="quoteCard" checked={state.addons.quoteCard} onChange={handleAddonChange} className="hidden" />
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${state.addons.quoteCard ? 'bg-blue-500 border-blue-500' : 'bg-black/30 border-white/20 group-hover:border-white/40'}`}>
                  {state.addons.quoteCard && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm text-gray-300">Display Quote Card</span>
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

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm text-gray-300 mb-2">GitHub Stats Card Style</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CARD_PREVIEWS.githubStats.map(card => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleAddonSelect('githubStatsProvider', card.id)}
                        className={`rounded-xl border p-2 text-left transition-all ${state.addons.githubStatsProvider === card.id ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.25)]' : 'border-white/10 hover:border-white/30'}`}
                      >
                        <img src={card.image} alt={card.label} className="w-full rounded-lg" />
                        <span className="mt-2 block text-xs text-gray-300">{card.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-300 mb-2">Top Languages Card Style</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CARD_PREVIEWS.topLangs.map(card => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleAddonSelect('topLangsProvider', card.id)}
                        className={`rounded-xl border p-2 text-left transition-all ${state.addons.topLangsProvider === card.id ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.25)]' : 'border-white/10 hover:border-white/30'}`}
                      >
                        <img src={card.image} alt={card.label} className="w-full rounded-lg" />
                        <span className="mt-2 block text-xs text-gray-300">{card.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-300 mb-2">Streak Card Style</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CARD_PREVIEWS.streak.map(card => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleAddonSelect('streakProvider', card.id)}
                        className={`rounded-xl border p-2 text-left transition-all ${state.addons.streakProvider === card.id ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.25)]' : 'border-white/10 hover:border-white/30'}`}
                      >
                        <img src={card.image} alt={card.label} className="w-full rounded-lg" />
                        <span className="mt-2 block text-xs text-gray-300">{card.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-300 mb-2">Quote Card Preview</p>
                  <button
                    type="button"
                    onClick={() => handleAddonChange({ target: { name: 'quoteCard', type: 'checkbox', checked: !state.addons.quoteCard } })}
                    className={`rounded-xl border p-2 text-left transition-all ${state.addons.quoteCard ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.25)]' : 'border-white/10 hover:border-white/30'}`}
                  >
                    <img src={CARD_PREVIEWS.quote.image} alt={CARD_PREVIEWS.quote.label} className="w-full rounded-lg" />
                    <span className="mt-2 block text-xs text-gray-300">{CARD_PREVIEWS.quote.label}</span>
                  </button>
                </div>
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
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                img: MarkdownImage
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
