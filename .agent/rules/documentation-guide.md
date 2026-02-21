---
trigger: always_on
---

Here is the optimized Workspace Rule for shadcn/ui in English.

Copy and paste the content below into a new file (e.g., shadcn-rules.md) within the Customization > Rules section of your Antigravity agent:

🎨 Component Standard: shadcn/ui
Reference Documentation:

Official Docs: https://ui.shadcn.com/docs

Component List: https://ui.shadcn.com/docs/components

Implementation Guidelines:

Source of Truth: Always prioritize the syntax and patterns defined in the official documentation links provided above. If there is a conflict between your training data and the docs, follow the docs.

Installation: Do not attempt to install components via standard npm install. Use the CLI command: npx shadcn@latest add [component-name].

Import Path: Use the @/components/ui alias for all shadcn component imports.

Styling: Use Tailwind CSS utility classes exclusively. Respect the CSS variables defined in globals.css (e.g., --primary, --foreground, --radius).

Radix UI & Accessibility: Maintain all Radix UI primitives and ARIA attributes included in the shadcn source code to ensure full accessibility.

Best Practices: - Use lucide-react for icons unless specified otherwise.

Use cn() utility for conditional class merging.

Prefer Functional Components with TypeScript interfaces.