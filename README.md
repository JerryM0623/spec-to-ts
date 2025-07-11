# OpenAPI to TypeScript Interface Generator

A web-based tool to automatically generate TypeScript interfaces from an OpenAPI (v2/v3) specification.

## ✨ Features

- **Multiple Input Methods**: Paste your spec directly, or fetch it from a public URL.
- **Broad Compatibility**: Supports both JSON and YAML formats for OpenAPI v2 (Swagger) and v3.
- **Smart Schema Detection**: Automatically finds and processes schemas, whether they are in the standard `components/schemas` section or defined inline within API paths.
- **Intelligent Naming**: Generates clean, readable interface names (e.g., `LoginParams`) from API paths.
- **Accurate Type Generation**:
    - Correctly maps OpenAPI data types to TypeScript types.
    - Handles `required` fields to generate mandatory or optional (`?`) properties.
    - Supports `enum` types, generating corresponding union types.
    - Resolves `$ref` references between schemas.
- **Rich Output**:
    - Generates JSDoc comments from `description` fields in the spec.
    - Displays the generated code with syntax highlighting.
    - Provides a "Copy to Clipboard" button for convenience.

## 🛠️ Tech Stack

- **Framework**: React (with Hooks)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **Parsing**: `js-yaml`

## 🚀 How to Use

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd spec-to-ts
    ```

2.  **Install dependencies**
    This project uses `pnpm` as the package manager.
    ```bash
    pnpm install
    ```

3.  **Run the development server**
    ```bash
    pnpm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).
