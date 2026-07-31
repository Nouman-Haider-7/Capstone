# Notes: Hand-Built vs shadcn/ui Components

## What I Built
Three components from scratch in `src/components/`: `Disclosure.tsx`, `Tabs.tsx`, and `Modal.tsx`, following W3C ARIA Authoring Practices patterns. All three were tested keyboard-only (Tab, Enter/Space, Arrow keys, Escape) and confirmed working correctly, including focus trapping and focus return in the modal.

## Gaps Found Comparing to shadcn/ui (Base UI)

1. **Scroll locking on the body.** My hand-built Modal does not prevent the page behind it from scrolling while open. shadcn's Dialog (via Base UI) handles this automatically, locking body scroll when the dialog is open and restoring it on close - something I hadn't considered as part of "accessibility" but affects usability for keyboard and screen reader users navigating a still-scrollable background.

2. **Portal rendering.** shadcn's Dialog renders its content through a React portal (outside the normal DOM tree, typically appended near the document body), which avoids z-index and overflow/clipping issues from parent containers. My Modal renders inline within the component tree, which works for a simple page but could break in a more complex layout with nested overflow:hidden containers.

3. **Animation and state-based styling via `data-state`.** shadcn's components use `data-state="open"/"closed"` attributes to drive CSS transitions smoothly (mount/unmount animations), rather than the simple conditional render I used (`if (!isOpen) return null`), which shows/hides instantly with no transition.

4. **More defensive focus handling.** My focus trap manually queries focusable elements via `querySelectorAll` each time Tab is pressed. shadcn's underlying Base UI primitives handle this through tested internal logic that accounts for edge cases I didn't consider, like dynamically added/removed focusable elements while the dialog is open.

## Takeaway
Building these by hand first made the ARIA roles, keyboard interactions, and focus trap concept genuinely clear - I understood *why* each piece mattered rather than just copying a pattern. But comparing to shadcn's versions showed that a production-ready component handles several edge cases (scroll locking, portal rendering, animation states, more robust focus queries) that aren't obvious until you either hit the bug yourself or read a library that already solved it.