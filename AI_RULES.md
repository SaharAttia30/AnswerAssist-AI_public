# AI Development Rules for AnswerAssist AI

This document outlines the core technologies used in this project and provides clear guidelines for their usage to ensure consistency, maintainability, and adherence to best practices.

## Tech Stack Overview

*   **React:** The primary JavaScript library for building user interfaces.
*   **TypeScript:** All new and existing code should be written in TypeScript for type safety and improved developer experience.
*   **React Router:** Used for client-side routing to manage navigation within the application.
*   **Tailwind CSS:** The utility-first CSS framework for all styling.
*   **shadcn/ui:** A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **TanStack Query (React Query):** For efficient data fetching, caching, and state management.
*   **React Hook Form & Zod:** Used together for robust form management and validation.
*   **Lucide React:** The icon library for all visual icons.
*   **Vite:** The build tool for a fast development experience.

## Library Usage Guidelines

To maintain a consistent and efficient codebase, please adhere to the following rules when developing:

*   **React:**
    *   Always create functional components.
    *   Use React Hooks for state and side effects.
    *   Prioritize creating small, focused components, ideally under 100 lines of code.
    *   New components should always be created in their own dedicated files within `src/components/`.

*   **TypeScript:**
    *   Ensure all new files are `.tsx` or `.ts`.
    *   Define clear interfaces and types for props, state, and data structures.

*   **React Router:**
    *   All main application routes should be defined and managed within `src/App.tsx`.
    *   Use `useNavigate` for programmatic navigation.

*   **Tailwind CSS:**
    *   **Exclusive Styling:** All component styling must be done using Tailwind CSS utility classes. Avoid inline styles or separate CSS modules for components.
    *   **Responsiveness:** Always consider responsive design using Tailwind's responsive prefixes (e.g., `md:`, `lg:`).

*   **shadcn/ui:**
    *   **Prefer Pre-built Components:** Whenever a suitable component exists in `src/components/ui/`, use it.
    *   **No Direct Modification:** Do NOT modify the source files of `shadcn/ui` components (e.g., `src/components/ui/button.tsx`). If a component needs custom behavior or styling beyond what `cn` utility allows, create a new component file (e.g., `src/components/MyCustomButton.tsx`) and compose or extend the `shadcn/ui` component.

*   **TanStack Query:**
    *   Use `useQuery` for fetching data and `useMutation` for data modifications.
    *   Centralize query keys for better cache management.

*   **React Hook Form & Zod:**
    *   All forms should be built using `react-hook-form` for state management and validation.
    *   Use `zod` for defining form schemas and validation rules, integrated with `@hookform/resolvers`.

*   **Lucide React:**
    *   Use icons from `lucide-react` for all visual iconography.

*   **Sonner:**
    *   For all toast notifications, use the `sonner` library. It's already integrated and available via the `Sonner` component in `App.tsx`.

*   **File Structure:**
    *   `src/pages/`: For top-level views/pages.
    *   `src/components/`: For reusable UI components.
    *   `src/contexts/`: For React Context providers.
    *   `src/hooks/`: For custom React hooks.
    *   `src/lib/`: For utility functions.

By following these guidelines, we ensure a consistent, high-quality, and easily maintainable codebase.