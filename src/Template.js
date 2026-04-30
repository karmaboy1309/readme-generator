export const generateProfileReadme = (state) => {
  const {
    name, subtitle,
    aboutMe,
    socials,
    skills,
    addons
  } = state;

  let markdown = '';

  // 1. Header
  markdown += `<h1 align="center">Hi 👋, I'm ${name || 'Developer'}</h1>\n`;
  if (subtitle) {
    markdown += `<h3 align="center">${subtitle}</h3>\n`;
  }
  
  if (addons.visitorsBadge && socials.github) {
    markdown += `<p align="center"> <img src="https://komarev.com/ghpvc/?username=${socials.github}&label=Profile%20views&color=0e75b6&style=flat" alt="${socials.github}" /> </p>\n`;
  }
  markdown += `\n`;

  // 2. Social Links
  const activeSocials = Object.entries(socials).filter(([key, value]) => value && key !== 'github'); // Keep github for stats, but handle link if needed
  if (activeSocials.length > 0) {
    const socialTags = activeSocials.map(([key, value]) => {
      let url = value;
      let iconName = `${key}.svg`;
      
      // Fix up URLs for some platforms
      if (key === 'twitter') url = `https://twitter.com/${value}`;
      else if (key === 'linkedin') url = `https://linkedin.com/in/${value}`;
      else if (key === 'youtube') url = `https://youtube.com/c/${value}`;
      else if (key === 'instagram') url = `https://instagram.com/${value}`;
      else if (key === 'medium') url = `https://medium.com/@${value}`;
      else if (key === 'devto') url = `https://dev.to/${value}`;
      else if (key === 'stackoverflow') url = `https://stackoverflow.com/users/${value}`;
      else if (key === 'discord') url = `https://discord.gg/${value}`;

      if (key === 'linkedin') iconName = 'linked-in-alt.svg';
      
      let iconUrl = `https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/${iconName}`;
      
      // Fallbacks for potentially broken icons in the repo
      if (key === 'stackoverflow') iconUrl = 'https://cdn.simpleicons.org/stackoverflow/0079CC';
      if (key === 'leetcode') iconUrl = 'https://cdn.simpleicons.org/leetcode/FFA116';
      if (key === 'discord') iconUrl = 'https://cdn.simpleicons.org/discord/5865F2';

      return `<a href="${url}" target="blank"><img src="${iconUrl}" alt="${key}" height="30" width="40" /></a>`;
    });
    
    markdown += socialTags.join(' ') + `\n\n`;
  }

  // 3. About Me (Work, Learn, Collab, etc.)
  const aboutLines = [];
  aboutMe.forEach((item) => {
    if (item.value) {
      if (item.hasLink && item.link) {
        aboutLines.push(`- ${item.prefix} [${item.value}](${item.link})`);
      } else {
        aboutLines.push(`- ${item.prefix} **${item.value}**`);
      }
    }
  });

  if (aboutLines.length > 0) {
    markdown += `## 🙋‍♂️ About Me\n\n${aboutLines.join('\n')}\n\n`;
  }

  // 4. Skills (Tech Stack)
  const activeSkills = [];
  Object.values(skills).forEach(categorySkills => {
    activeSkills.push(...categorySkills);
  });

  if (activeSkills.length > 0) {
    markdown += `## 💻 Tech Stack\n\n`;
    const skillTags = activeSkills.map(tech => {
      return `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.id}/${tech.icon}" height="40" alt="${tech.name} logo" />`;
    });
    
    markdown += skillTags.join(' ') + `\n\n`;
  }

  // 5. GitHub Stats (Gitlyy or traditional)
  if ((addons.githubStats || addons.topLangs || addons.streakStats) && socials.github) {
    markdown += `## 📊 GitHub Stats\n\n<div align="center">\n`;
    
    // We can use Gitlyy for these stats as requested before, but user said "content and all should be like this [rahul's]".
    // Rahul's generator uses Anurag Hazra's github-readme-stats. Let's use Gitlyy to promote our own tool!
    // Since Gitlyy is the user's project, we must prioritize Gitlyy endpoints.
    
    const theme = addons.githubStatsTheme || 'dark';
    
    if (addons.githubStats) {
      markdown += `  <img src="https://gitlyy.vercel.app/api/overview?username=${socials.github}&theme=${theme}" alt="${socials.github}'s GitHub Overview" />\n<br/>\n<br/>\n`;
    }
    
    if (addons.topLangs && addons.streakStats) {
      markdown += `  <img src="https://gitlyy.vercel.app/api/languages?username=${socials.github}&theme=${theme}&layout=donut" alt="${socials.github}'s Top Languages" height="200" />\n`;
      markdown += `  <img src="https://gitlyy.vercel.app/api/streak?username=${socials.github}&theme=${theme}" alt="${socials.github}'s Streak" height="200" />\n`;
    } else if (addons.topLangs) {
      markdown += `  <img src="https://gitlyy.vercel.app/api/languages?username=${socials.github}&theme=${theme}&layout=compact" alt="${socials.github}'s Top Languages" />\n`;
    } else if (addons.streakStats) {
      markdown += `  <img src="https://gitlyy.vercel.app/api/streak?username=${socials.github}&theme=${theme}" alt="${socials.github}'s Streak" />\n`;
    }
    
    markdown += `</div>\n\n`;
  }

  return markdown;
};
