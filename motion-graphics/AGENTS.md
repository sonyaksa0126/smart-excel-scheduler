# HyperFrames Motion Graphics Workflow & Guidelines

When working on any video or motion graphics tasks in this project, **NEVER** autonomously render a final video first. You **MUST** strictly follow this 3-step collaborative process with the user:

---

## 📋 The 3-Step Collaborative Process

### 1단계: [기획 확인] (Planning Confirmation)
- **Action**: When the user provides a video idea, **DO NOT** write code or trigger renders.
- **Deliverable**: Summarize the following in text first:
  1. **영상에 들어갈 문구 / 카피** (Text copy to be included)
  2. **대략적인 모션 흐름 및 타임라인 초수** (Approximate timeline structure and duration)
  3. **시각적 연출 및 연출 방식** (Visual direction and style)
- **Goal**: Ask for the user's explicit feedback and approval on the textual plan before proceeding.

### 2단계: [이미지 프리뷰 제공] (Visual Preview)
- **Action**: Once the concept is approved, implement the code structure.
- **Deliverable**: Provide a static visual layout preview (e.g., static HTML/CSS draft, screenshot, or generated UI mockup) to showcase key frames (e.g., the title scene or transition states) so the user can verify the styling and layout.
- **Goal**: Get user visual alignment before running heavy animations or rendering.

### 3단계: [최종 수정 및 승인 후 제작] (Approved Render)
- **Action**: Collect final feedback from the preview stage. Modify the code if needed.
- **Deliverable**: Trigger the final MP4 compilation and rendering (`npm run motion:render`) **ONLY** when the user explicitly issues an approval command (e.g., `"이제 영상 만들어줘"`, `"Render"`, etc.).

---

## 🎨 Design Principles
- **Rich Aesthetics**: Always prioritize sleek modern layouts (dark mode, glassmorphism, dynamic glowing gradients, premium rounded typography like "Outfit" / "Inter" / "Noto Sans KR").
- **No Placeholders**: Never use placeholder text or dummy links. Make every detail feel functional and premium.
- **Zero-Error Linting**: Always run `npx hyperframes lint` and ensure **0 errors** are present before attempting a render.
