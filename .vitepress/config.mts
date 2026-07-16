import { defineConfig } from 'vitepress'

// Every topic folder is `Some Folder Name/README.md` on disk (spaces, README
// convention — GitHub auto-renders README.md when browsing a folder, so the
// source files themselves are left untouched). VitePress only builds pages
// from `index.md`, so each `README.md` is virtually rewritten to `index.md`
// **inside the same folder** — this changes nothing on disk, it only tells
// the build "treat this file as this folder's index page". Because the
// folder name doesn't change, every existing relative link written before
// this site existed (`./Design%20Process/`, `../Skills/`, …) keeps resolving
// correctly with zero edits to content.
const rewrites: Record<string, string> = {
  'README.md': 'index.md'
}
for (const dir of [
  'Getting Started',
  'Glossary',
  'Example Walkthroughs',
  'Cheat Sheet',
  'Prompting Patterns',
  'Skills',
  'Subagents',
  'Loop Engineering',
  'Harness',
  'MCP Playbook',
  'Plugins Playbook',
  'Memory and Context',
  'Worktrees and Parallel Agents',
  'Headless and CI',
  'Hooks Cookbook',
  'Agent Team Patterns',
  'Spec to Implementation',
  'Verification Recipes',
  'Cost and Observability',
  'Model Selection',
  'Prompt Library',
  'Templates',
  'Docs Maintenance',
  'Design Process',
  'Common Mistakes',
  'Git and PR Workflow',
  'Security Guardrails',
  'Release and Deployment',
  'Database Change Workflow',
  'AI Coding Standards',
  'Failure Postmortems',
  'Troubleshooting and FAQ',
  'CLAUDE.md Best Practices',
  'Claude Directory Layout',
  'Project Setup Checklist',
  'Team Adoption',
  '10 Levels of Claude Code'
]) {
  rewrites[`${dir}/README.md`] = `${dir}/index.md`
}

export default defineConfig({
  title: 'Claude Playbook',
  description:
    'A personal, growing knowledge base of findings, patterns, and templates for working effectively with Claude and Claude Code.',
  srcDir: '.',
  // Served from https://qasimali-infinikorn.github.io/claude-playbook/ (a
  // project page, not a user/org root page or custom domain) — every asset
  // and route needs this prefix or the deployed site 404s on refresh/deep-link.
  base: '/claude-playbook/',
  cleanUrls: true,
  // Only the intentionally-excluded vendored files (see srcExclude) are
  // allowed to dead-link — everything else should be a real, resolvable page.
  ignoreDeadLinks: [/^\.\/skills\//, /^\.\/CLAUDE$/],
  lastUpdated: true,

  // Vendored skill sources (Design Process/skills/*/SKILL.md) are reference
  // material, not prose docs — keep them out of the built page list. The
  // CLAUDE.md template is meant to be copied verbatim into a project, and its
  // `<placeholder>` syntax isn't valid as a Vue template, so it can't be
  // rendered as a page either — link to it on GitHub instead of building it.
  srcExclude: [
    '**/skills/*/SKILL.md',
    '**/node_modules/**',
    'CLAUDE.md Best Practices/CLAUDE.md'
  ],

  rewrites,

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' }
  },

  themeConfig: {
    logo: '🧭',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/Getting%20Started/' },
      { text: 'Cheat Sheet', link: '/Cheat%20Sheet/' },
      { text: 'Glossary', link: '/Glossary/' }
    ],

    sidebar: [
      {
        text: 'Start here',
        items: [
          { text: 'Getting Started', link: '/Getting%20Started/' },
          { text: 'Glossary', link: '/Glossary/' },
          { text: 'Example Walkthroughs', link: '/Example%20Walkthroughs/' },
          { text: 'Cheat Sheet', link: '/Cheat%20Sheet/' }
        ]
      },
      {
        text: 'Working well',
        items: [
          { text: 'Prompting Patterns', link: '/Prompting%20Patterns/' },
          { text: 'Skills', link: '/Skills/' },
          { text: 'Subagents', link: '/Subagents/' },
          { text: 'Loop Engineering', link: '/Loop%20Engineering/' },
          { text: 'Harness', link: '/Harness/' },
          { text: 'MCP Playbook', link: '/MCP%20Playbook/' },
          { text: 'Plugins Playbook', link: '/Plugins%20Playbook/' },
          { text: 'Memory & Context', link: '/Memory%20and%20Context/' },
          { text: 'Worktrees & Parallel Agents', link: '/Worktrees%20and%20Parallel%20Agents/' },
          { text: 'Headless & CI', link: '/Headless%20and%20CI/' },
          { text: 'Hooks Cookbook', link: '/Hooks%20Cookbook/' },
          { text: 'Agent Team Patterns', link: '/Agent%20Team%20Patterns/' },
          { text: 'Spec to Implementation', link: '/Spec%20to%20Implementation/' },
          { text: 'Verification Recipes', link: '/Verification%20Recipes/' },
          { text: 'Cost & Observability', link: '/Cost%20and%20Observability/' },
          { text: 'Model Selection', link: '/Model%20Selection/' },
          { text: 'Prompt Library', link: '/Prompt%20Library/' },
          { text: 'Templates', link: '/Templates/' },
          { text: 'Docs Maintenance', link: '/Docs%20Maintenance/' },
          { text: 'Design Process', link: '/Design%20Process/' },
          { text: 'Common Mistakes', link: '/Common%20Mistakes/' }
        ]
      },
      {
        text: 'Doing it safely',
        items: [
          { text: 'Git & PR Workflow', link: '/Git%20and%20PR%20Workflow/' },
          { text: 'Security Guardrails', link: '/Security%20Guardrails/' },
          { text: 'Release & Deployment', link: '/Release%20and%20Deployment/' },
          { text: 'Database Change Workflow', link: '/Database%20Change%20Workflow/' },
          { text: 'AI Coding Standards', link: '/AI%20Coding%20Standards/' },
          { text: 'Failure Postmortems', link: '/Failure%20Postmortems/' },
          { text: 'Troubleshooting & FAQ', link: '/Troubleshooting%20and%20FAQ/' }
        ]
      },
      {
        text: 'Setting up projects',
        items: [
          { text: 'CLAUDE.md Best Practices', link: '/CLAUDE.md%20Best%20Practices/' },
          { text: 'Claude Directory Layout', link: '/Claude%20Directory%20Layout/' },
          { text: 'Project Setup Checklist', link: '/Project%20Setup%20Checklist/' },
          { text: 'Team Adoption', link: '/Team%20Adoption/' },
          { text: '10 Levels of Claude Code', link: '/10%20Levels%20of%20Claude%20Code/' }
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/qasimali-infinikorn/claude-playbook' }
    ],

    editLink: {
      pattern: 'https://github.com/qasimali-infinikorn/claude-playbook/edit/main/:path',
      text: 'Edit this page on GitHub'
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    footer: {
      message: 'A living notebook — add to it every time something works well.'
    }
  }
})
