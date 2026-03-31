# Design System Specification: The Scholastic Curator

## 1. Overview & Creative North Star
The objective of this design system is to transform the dense, often-cumbersome data of a University Administrative Portal into a high-end editorial experience. We are moving away from the "industrial" feel of legacy enterprise software and toward a philosophy we call **"The Scholastic Curator."**

This North Star prioritizes clarity through breathing room, authoritative typography, and a "layered paper" aesthetic. We break the traditional rigid grid by utilizing intentional asymmetry—such as offset headers and varied column widths—to guide the eye through complex student and course data. By treating every view like a curated exhibition of information, we provide administrators with a sense of calm and institutional prestige.

## 2. Colors
This system utilizes a sophisticated neutral palette centered on Slate and Gray, punctuated by a high-precision Primary Blue.

*   **Primary Action Accent:** `primary` (#005ac3) is reserved for high-intent actions. To add "soul," main CTAs should utilize a subtle linear gradient from `primary` to `primary_dim` at a 145-degree angle.
*   **The "No-Line" Rule:** To achieve a premium feel, designers are prohibited from using 1px solid borders for major sectioning. Boundaries must be defined through background shifts. For example, a sidebar should use `surface_container_low` against a `surface` main content area.
*   **Surface Hierarchy & Nesting:** Treat the UI as a series of physical layers. 
    *   **Base:** `surface` (#f8f9ff)
    *   **Sub-sections:** `surface_container_low`
    *   **Active/Elevated Cards:** `surface_container_lowest` (#ffffff)
*   **The "Glass & Gradient" Rule:** Floating elements (like navigation bars or hovering modals) must use Glassmorphism. Apply `surface_container_highest` with 80% opacity and a `20px` backdrop-blur to allow underlying data colors to bleed through, softening the interface.

## 3. Typography
We use **Inter** exclusively to maintain a clean, technical, yet humanistic tone. The hierarchy is designed to feel editorial, emphasizing large-scale numbers and clear labels.

*   **Display & Headlines:** Use `display-md` for high-level metrics (e.g., total enrollment counts or GPA averages). This creates an authoritative "dashboard" feel.
*   **Titles:** `title-lg` and `title-md` serve as the primary identifiers for ERD entities like "Course Name" or "Study Program."
*   **Body:** `body-md` is the workhorse for data entry and descriptive text.
*   **Labels:** Use `label-sm` in all-caps with a `0.05em` letter-spacing for metadata (e.g., "ID_STATUS" or "CREDITS" from the database) to provide a "technical ledger" aesthetic.

## 4. Elevation & Depth
Depth is achieved through Tonal Layering and ambient light simulation, rather than heavy drop shadows.

*   **The Layering Principle:** Stacking is the primary method of hierarchy. Place a `surface_container_lowest` card on a `surface_container_low` background to create a natural "lift."
*   **Ambient Shadows:** When a floating effect is required (e.g., sleek modals), use a shadow with a blur of `32px`, an Y-offset of `8px`, and a color derived from `on_surface` at only 4% opacity. This mimics natural, diffused light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility in high-density tables, it must be a "Ghost Border." Use the `outline_variant` token at 15% opacity. Never use 100% opaque borders for interior containment.

## 5. Components
Each component is designed to be crisp, utilizing a refined `DEFAULT` (4px) to `md` (6px) border radius.

*   **Buttons:**
    *   *Primary:* Gradient fill (`primary` to `primary_dim`) with `on_primary` text.
    *   *Secondary:* `surface_container_highest` background with a 1px Ghost Border.
    *   *Hover State:* Use a `primary_fixed_variant` overlay to create a subtle "glow" effect without changing the button's dimensions.
*   **Status Badges:** Crucial for the `id_status` entity. Use low-saturation backgrounds (e.g., `tertiary_container`) with high-saturation text (`on_tertiary_container`) to indicate state without overwhelming the visual field.
*   **Cards & Lists:** Following the ERD context for "Schedules" and "Courses," forbid the use of divider lines. Separate items using the `3` spacing scale (1rem) or subtle background alternates between `surface` and `surface_container_low`.
*   **Avatar Circles:** For the `user` entity, avatars should have a 1px Ghost Border to prevent them from "bleeding" into the background.
*   **Sleek Modals:** Modals must occupy the center-right of the screen (asymmetric) rather than the dead center. This allows the administrator to maintain context of the underlying data grid.

## 6. Do's and Don'ts

### Do:
*   **Use the Spacing Scale:** Rely on `6` (2rem) and `8` (2.75rem) to separate major data groups, such as "Course Information" from "Enrollment Schedules."
*   **Prioritize Focus States:** Use a `2px` solid `outline` (#4f7db5) with a `2px` offset for all keyboard navigation to ensure high accessibility.
*   **Leverage Whitespace:** Let the `surface` color breathe. High-end design is defined by what you leave out.

### Don't:
*   **No "Boxy" Dividers:** Avoid the "Excel" look. Do not wrap every table cell in a border. 
*   **No Pure Black:** Never use `#000000` for shadows or text. Always use the `on_surface` (#00345e) or `secondary` (#5e5f65) tokens to maintain tonal harmony.
*   **Avoid Default Radius:** Do not exceed `0.75rem` (xl) for any element. This design system relies on "crispness," and overly rounded corners degrade the professional, institutional tone.