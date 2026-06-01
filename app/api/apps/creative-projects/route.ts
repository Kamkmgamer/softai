import { apiError, apiSuccess, readJson, requireAppUser } from "@/lib/api";
import { getProviderJobMetadata, getProviderRoute } from "@/lib/ai-provider-router";
import { holdImageCredits, refundImageCredits, settleImageCredits } from "@/lib/credits";
import { assertPromptAllowed } from "@/lib/moderation";
import { generateReferencedImage, generateSceneImage } from "@/lib/openrouter";
import {
  addBrandAsset,
  approveStoryboard,
  createGenerationJob,
  createOutput,
  createProject,
  saveSceneImage,
  saveStoryboard,
  updateGenerationJob,
} from "@/lib/store";
import type { ProjectKind } from "@/lib/types";
import { creativeAppSchema } from "@/lib/validators";

type CreativeInput = Awaited<ReturnType<typeof readCreativeInput>>;

type ImageAppInput = Extract<CreativeInput, { app: "text-to-image" | "image-editor" | "expand-image" | "stylize-image" | "product-reshoot" | "vary-image" | "mockup" | "create-ad" | "batch-social" | "carousel-builder" | "hook-generator" | "platform-resizer" | "style-transfer" | "surreal-scene" | "visual-remix" | "ab-variants" | "seasonal-transform" }>;

function readCreativeInput(request: Request) {
  return readJson(request, creativeAppSchema);
}

function titleFromPrompt(prompt: string) {
  return prompt.trim().slice(0, 64) + (prompt.trim().length > 64 ? "..." : "");
}

function buildBrandContext(brandKit: CreativeInput["brandKit"]): string {
  if (!brandKit) return "";
  const parts: string[] = [];
  if (brandKit.name) parts.push(`Brand: ${brandKit.name}`);
  if (brandKit.primaryColor) parts.push(`Primary color: ${brandKit.primaryColor}`);
  if (brandKit.secondaryColor) parts.push(`Secondary color: ${brandKit.secondaryColor}`);
  if (brandKit.toneOfVoice) parts.push(`Tone of voice: ${brandKit.toneOfVoice}`);
  if (brandKit.fonts?.heading) parts.push(`Heading font: ${brandKit.fonts.heading}`);
  if (brandKit.fonts?.body) parts.push(`Body font: ${brandKit.fonts.body}`);
  return parts.length > 0 ? `Brand identity context: ${parts.join(". ")}. Apply these brand elements consistently.` : "";
}

function getKind(app: CreativeInput["app"]): ProjectKind {
  if (app === "text-to-image") return "text_to_image";
  if (app === "image-editor") return "image_edit";
  if (app === "expand-image") return "image_edit";
  if (app === "stylize-image") return "image_edit";
  if (app === "product-reshoot") return "image_edit";
  if (app === "vary-image") return "image_edit";
  if (app === "mockup") return "mockup";
  if (app === "create-ad") return "create_ad";
  if (app === "batch-social") return "text_to_image";
  if (app === "carousel-builder") return "text_to_image";
  if (app === "hook-generator") return "text_to_image";
  if (app === "platform-resizer") return "image_edit";
  if (app === "style-transfer") return "image_edit";
  if (app === "surreal-scene") return "text_to_image";
  if (app === "visual-remix") return "image_edit";
  if (app === "ab-variants") return "create_ad";
  if (app === "seasonal-transform") return "image_edit";
  if (app === "script-to-storyboard") return "multi_shot_video";
  if (app === "lesson-to-video") return "multi_shot_video";
  if (app === "explainer-video") return "multi_shot_video";
  if (app === "whiteboard-animation") return "multi_shot_video";
  if (app === "course-trailer") return "multi_shot_video";
  if (app === "loop-generator") return "multi_shot_video";
  return "video_edit";
}

function getAppLabel(app: CreativeInput["app"]) {
  if (app === "text-to-image") return "Text to Image";
  if (app === "image-editor") return "AI Image Editor";
  if (app === "expand-image") return "Expand Image";
  if (app === "stylize-image") return "Stylize Image";
  if (app === "product-reshoot") return "Product Reshoot";
  if (app === "vary-image") return "Vary Image";
  if (app === "mockup") return "Mockup Generator";
  if (app === "create-ad") return "Create Ad";
  if (app === "batch-social") return "Batch Social Generator";
  if (app === "carousel-builder") return "Carousel Builder";
  if (app === "hook-generator") return "Hook Generator";
  if (app === "platform-resizer") return "Platform Resizer";
  if (app === "style-transfer") return "Style Transfer";
  if (app === "surreal-scene") return "Surreal Scene Builder";
  if (app === "visual-remix") return "Visual Remix";
  if (app === "ab-variants") return "A/B Variant Generator";
  if (app === "seasonal-transform") return "Seasonal Campaign Transformer";
  if (app === "script-to-storyboard") return "Script to Storyboard";
  if (app === "lesson-to-video") return "Lesson to Video";
  if (app === "explainer-video") return "Explainer Video Builder";
  if (app === "whiteboard-animation") return "Whiteboard Animation";
  if (app === "course-trailer") return "Course Trailer";
  if (app === "loop-generator") return "Loop Generator";
  return "Edit Studio";
}

function buildImagePrompt(input: ImageAppInput) {
  const brandContext = buildBrandContext(input.brandKit);

  if (input.app === "expand-image") {
    return [
      "Expand/outpaint the provided image beyond its current borders.",
      `Expansion direction and content: ${input.prompt}.`,
      `Target aspect ratio: ${input.aspectRatio}.`,
      `Style: ${input.style}.`,
      `Use this source image as the starting point: ${input.sourceImageUrl}. Seamlessly extend the image content, matching lighting, perspective, color palette, and style perfectly.`,
      "The expanded area must look naturally continuous with the original image. Avoid visible seams, abrupt color shifts, or style mismatches.",
      "Avoid embedded text, fake letters, labels, watermarks, captions, UI, or logos.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "stylize-image") {
    return [
      "Apply an artistic style transformation to the provided image.",
      `Requested style: ${input.prompt}.`,
      `Style preset: ${input.style}.`,
      `Target aspect ratio: ${input.aspectRatio}.`,
      `Use this source image as the reference: ${input.sourceImageUrl}. Transform the visual style while preserving the subject composition and recognizable elements.`,
      "The result should feel like a cohesive artistic interpretation, not a simple filter overlay.",
      "Avoid embedded text, fake letters, labels, watermarks, captions, UI, or logos.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "product-reshoot") {
    return [
      "Reshoot the product in the provided image in a new setting.",
      `New scene description: ${input.prompt}.`,
      `Photography style: ${input.style}.`,
      `Aspect ratio: ${input.aspectRatio}.`,
      `Use this source image as the product reference: ${input.sourceImageUrl}. The product must remain exactly recognizable — same shape, colors, branding, and proportions.`,
      "Place the product naturally in the new scene with realistic lighting, shadows, and reflections that match the environment.",
      "Avoid embedded text, fake letters, labels, watermarks, captions, UI, or logos unless they are part of the original product.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "vary-image") {
    return [
      "Create a variation of the provided image with specific changes.",
      `Changes requested: ${input.prompt}.`,
      `Variation style: ${input.style}.`,
      `Aspect ratio: ${input.aspectRatio}.`,
      `Use this source image as the reference: ${input.sourceImageUrl}. Preserve the overall composition, framing, and subject while applying the requested changes.`,
      "The variation should feel like a deliberate creative choice, not a random alteration.",
      "Avoid embedded text, fake letters, labels, watermarks, captions, UI, or logos unless they are part of the original.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "mockup") {
    return [
      "Place the provided design onto a real-world product mockup.",
      `Mockup scene description: ${input.prompt}.`,
      `Photography style: ${input.style}.`,
      `Aspect ratio: ${input.aspectRatio}.`,
      `Use this source design image: ${input.sourceImageUrl}. The design must be placed naturally onto the product — respecting perspective, curvature, lighting, and material texture.`,
      "The result should look like a professional product photograph showcasing the design in context.",
      "Avoid embedded text, fake letters, labels, watermarks, captions, UI, or logos unless they are part of the original design.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "create-ad") {
    const sourceInstruction = input.sourceImageUrl
      ? `Use this source image as the ad reference: ${input.sourceImageUrl}. Adapt the visual style, layout, and product presentation while applying the requested changes.`
      : "Create the ad from scratch based on the description.";
    return [
      "Create a high-converting ad creative for a small business campaign.",
      `Ad description: ${input.prompt}.`,
      `Visual style: ${input.style}.`,
      `Aspect ratio: ${input.aspectRatio}.`,
      sourceInstruction,
      "The result should look like a polished, platform-ready ad with strong visual hierarchy and clear product focus.",
      "Avoid embedded text, fake letters, labels, watermarks, captions, UI, or logos unless they are part of the original referenced product.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "batch-social") {
    return [
      `Generate ${input.postCount} social media posts for ${input.platform}.`,
      `Content theme: ${input.prompt}.`,
      `Visual style: ${input.style}.`,
      `Aspect ratio: ${input.aspectRatio}.`,
      "Each post should be visually distinct but thematically cohesive, optimized for the target platform's format and audience.",
      "Include variety in composition, color, and layout across the batch.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "carousel-builder") {
    return [
      `Create a ${input.slideCount}-slide carousel post.`,
      `Topic: ${input.prompt}.`,
      `Design style: ${input.style}.`,
      `Aspect ratio: ${input.aspectRatio}.`,
      "Each slide should flow logically from the previous one, with consistent branding and visual style throughout.",
      "Design for readability with clear hierarchy and concise text overlays.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "hook-generator") {
    return [
      `Generate a scroll-stopping hook image for ${input.platform}.`,
      `Content theme: ${input.prompt}.`,
      `Visual style: ${input.style}.`,
      `Aspect ratio: ${input.aspectRatio}.`,
      "The image should be designed to stop scrolling immediately — bold, curiosity-driven, with space for a compelling text overlay.",
      "Optimize for the first 0.5 seconds of attention.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "platform-resizer") {
    return [
      "Resize and adapt the provided image for a specific platform.",
      `Platform: ${input.targetPlatform}.`,
      `Adjustment notes: ${input.prompt}.`,
      `Style: ${input.style}.`,
      `Use this source image: ${input.sourceImageUrl}. Intelligently crop, reframe, or extend the image to fit the target platform's optimal dimensions.`,
      "Preserve the most important visual elements while adapting to the new aspect ratio.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "style-transfer") {
    return [
      "Apply a distinct artistic style transformation to the provided image.",
      `Target style: ${input.prompt}.`,
      `Style preset: ${input.style}.`,
      `Aspect ratio: ${input.aspectRatio}.`,
      `Use this source image: ${input.sourceImageUrl}. Transform the visual style completely while preserving the subject matter and composition.`,
      "The result should feel like a masterful artistic reinterpretation.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "surreal-scene") {
    return [
      "Create a surrealist, dreamlike scene from the description.",
      `Scene: ${input.prompt}.`,
      `Artistic style: ${input.style}.`,
      `Aspect ratio: ${input.aspectRatio}.`,
      "Push the boundaries of reality — impossible geometry, floating objects, ethereal lighting, and dreamlike atmosphere.",
      "Inspired by surrealism, fantasy art, and digital dreamscape aesthetics.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "visual-remix") {
    return [
      "Create a remixed, reimagined version of the provided image.",
      `Remix direction: ${input.prompt}.`,
      `Style: ${input.style}.`,
      `Aspect ratio: ${input.aspectRatio}.`,
      `Use this source image as the base: ${input.sourceImageUrl}. Reimagine it with a bold creative transformation.`,
      "The remix should feel like a completely new artistic vision inspired by the original.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "ab-variants") {
    const sourceInstruction = input.sourceImageUrl
      ? `Use this source ad as the base: ${input.sourceImageUrl}. Create variations that test different visual approaches.`
      : "Create ad variants from the description.";
    return [
      `Generate ${input.variantCount} A/B test variants of an ad creative.`,
      `Base concept: ${input.prompt}.`,
      `Visual style: ${input.style}.`,
      `Aspect ratio: ${input.aspectRatio}.`,
      sourceInstruction,
      "Each variant should differ in a specific element — color palette, layout, focal point, or composition — to enable meaningful A/B testing.",
      brandContext,
    ].join(" ");
  }

  if (input.app === "seasonal-transform") {
    return [
      "Transform the provided ad into a seasonal campaign version.",
      `Target season/holiday: ${input.season}.`,
      `Adaptation notes: ${input.prompt}.`,
      `Style: ${input.style}.`,
      `Aspect ratio: ${input.aspectRatio}.`,
      `Use this source ad: ${input.sourceImageUrl}. Maintain the core product and message while applying seasonal theming.`,
      "Add seasonal atmosphere, colors, and mood while keeping the ad's conversion-focused design.",
      brandContext,
    ].join(" ");
  }

  const sourceInstruction = input.app === "image-editor"
    ? `Use this source image as the product/reference context: ${input.sourceImageUrl}. Preserve the important product identity while applying the requested edit.`
    : "Create the image from scratch.";

  return [
    "Create one polished, ad-ready image for a small business campaign.",
    `Requested result: ${input.prompt}.`,
    `Style or tool preset: ${input.style}.`,
    `Aspect ratio target: ${input.aspectRatio}.`,
    sourceInstruction,
    "Avoid embedded text, fake letters, labels, watermarks, captions, UI, or logos unless they are part of the original referenced product.",
    brandContext,
  ].join(" ");
}

function buildVideoEditScenes(input: Extract<CreativeInput, { app: "edit-studio" }>) {
  const source = input.sourceVideoUrl
    ? `Use the uploaded source video as edit context: ${input.sourceVideoUrl}.`
    : "No source video was supplied; create a fresh transformed commercial sequence from the prompt.";

  return [
    {
      title: "Edited opener",
      narration: "Open with the strongest transformed visual moment.",
      visualDirection: `${source} Apply this edit: ${input.prompt}. Establish the ${input.style} look immediately with a clean commercial opening frame.`,
      overlayText: "Before the scroll",
      durationSeconds: 4,
    },
    {
      title: "Transformation beat",
      narration: "Show the most noticeable AI edit clearly and confidently.",
      visualDirection: `Continue the edit while preserving subject continuity. Emphasize relighting, restyling, object/background changes, or pacing requested by the user: ${input.prompt}.`,
      overlayText: "AI edit applied",
      durationSeconds: 4,
    },
    {
      title: "Final polish",
      narration: "End on a clean, publishable result.",
      visualDirection: `Finish with a refined ${input.style} commercial hero shot, stable composition, and negative space for later CTA overlays.`,
      overlayText: "Ready to publish",
      durationSeconds: 4,
    },
  ];
}

function buildScriptToStoryboardScenes(input: Extract<CreativeInput, { app: "script-to-storyboard" }>) {
  return [
    {
      title: "Opening scene",
      narration: `Script opening: ${input.prompt}`,
      visualDirection: `Cinematic opening shot based on the script. ${input.style} style. Establish the setting and mood.`,
      overlayText: "",
      durationSeconds: 5,
    },
    {
      title: "Rising action",
      narration: `Script development: ${input.prompt}`,
      visualDirection: `Build narrative momentum. Continue the ${input.style} visual treatment with dynamic composition.`,
      overlayText: "",
      durationSeconds: 5,
    },
    {
      title: "Climax",
      narration: `Script peak moment: ${input.prompt}`,
      visualDirection: `The most impactful visual moment. Strong ${input.style} composition with dramatic emphasis.`,
      overlayText: "",
      durationSeconds: 4,
    },
    {
      title: "Resolution",
      narration: `Script closing: ${input.prompt}`,
      visualDirection: `Wrap up with a clean resolution frame. ${input.style} ending with space for CTA.`,
      overlayText: "",
      durationSeconds: 4,
    },
  ];
}

function buildLoopScenes(input: Extract<CreativeInput, { app: "loop-generator" }>) {
  return [
    {
      title: "Loop sequence",
      narration: `Seamless loop: ${input.prompt}`,
      visualDirection: `Generate a seamless looping visual sequence. ${input.style} style. The first and last frames should connect smoothly.`,
      overlayText: "",
      durationSeconds: 5,
    },
  ];
}

const VIDEO_APP_SET = new Set([
  "edit-studio",
  "lesson-to-video",
  "explainer-video",
  "whiteboard-animation",
  "course-trailer",
]);

const STORYBOARD_APP_SET = new Set([
  "script-to-storyboard",
  "loop-generator",
]);

function isVideoApp(app: string): boolean {
  return VIDEO_APP_SET.has(app);
}

function isStoryboardApp(app: string): boolean {
  return STORYBOARD_APP_SET.has(app);
}

function buildEducationalScenes(input: Extract<CreativeInput, { app: "lesson-to-video" | "explainer-video" | "whiteboard-animation" | "course-trailer" }>) {
  return [
    {
      title: "Introduction",
      narration: `Introduce the topic: ${input.prompt}.`,
      visualDirection: `Establish the ${input.style} visual style with an engaging opening scene. Set the context for the viewer.`,
      overlayText: "",
      durationSeconds: 5,
    },
    {
      title: "Core concept",
      narration: `Explain the main concept: ${input.prompt}.`,
      visualDirection: `Present the key information with clear visuals, diagrams, or illustrations in ${input.style} style.`,
      overlayText: "",
      durationSeconds: 5,
    },
    {
      title: "Example or demonstration",
      narration: `Show a practical example related to: ${input.prompt}.`,
      visualDirection: `Demonstrate the concept with a concrete example using ${input.style} visual treatment.`,
      overlayText: "",
      durationSeconds: 5,
    },
    {
      title: "Summary and call to action",
      narration: `Summarize the key takeaways from: ${input.prompt}.`,
      visualDirection: `Close with a clean summary frame and call to action in ${input.style} style.`,
      overlayText: "",
      durationSeconds: 4,
    },
  ];
}

export async function POST(request: Request) {
  let heldImageCreditsForProject: string | null = null;

  try {
    const user = await requireAppUser();
    const input = await readCreativeInput(request);
    assertPromptAllowed(input.prompt);

    const project = await createProject(user.id, {
      kind: getKind(input.app),
      title: titleFromPrompt(input.prompt),
      productName: getAppLabel(input.app),
      offer: input.style,
      cta: input.app === "edit-studio" ? "Render edited video" : "Use this creative",
      targetAudience: "small business customers",
      brandVoice: "polished, direct, commercial",
      platformTarget: "tiktok",
      language: "en",
      script: input.prompt,
      metadata: input,
    });

    if (input.app === "edit-studio") {
      await saveStoryboard(user.id, project.id, {
        headline: "AI video edit plan",
        hook: input.prompt,
        cta: "Render edited video",
        scenes: buildVideoEditScenes(input),
      });
      await approveStoryboard(user.id, project.id);
      return apiSuccess({ project: { id: project.id, title: project.title, kind: project.kind } }, { status: 201 });
    }

    if (isVideoApp(input.app)) {
      await saveStoryboard(user.id, project.id, {
        headline: getAppLabel(input.app),
        hook: input.prompt,
        cta: "Generate video",
        scenes: buildEducationalScenes(input as Extract<CreativeInput, { app: "lesson-to-video" | "explainer-video" | "whiteboard-animation" | "course-trailer" }>),
      });
      await approveStoryboard(user.id, project.id);
      return apiSuccess({ project: { id: project.id, title: project.title, kind: project.kind } }, { status: 201 });
    }

    if (isStoryboardApp(input.app)) {
      const scenes = input.app === "script-to-storyboard"
        ? buildScriptToStoryboardScenes(input as Extract<CreativeInput, { app: "script-to-storyboard" }>)
        : buildLoopScenes(input as Extract<CreativeInput, { app: "loop-generator" }>);
      await saveStoryboard(user.id, project.id, {
        headline: getAppLabel(input.app),
        hook: input.prompt,
        cta: input.app === "loop-generator" ? "Generate loop" : "Generate storyboard",
        scenes,
      });
      await approveStoryboard(user.id, project.id);
      return apiSuccess({ project: { id: project.id, title: project.title, kind: project.kind } }, { status: 201 });
    }

    await holdImageCredits(user.id, project.id);
    heldImageCreditsForProject = project.id;

    const route = getProviderRoute("image");
    const imageInput = input as ImageAppInput;
    const prompt = buildImagePrompt(imageInput);
    const sourceImageUrl =
      imageInput.app !== "text-to-image" && "sourceImageUrl" in imageInput
        ? imageInput.sourceImageUrl
        : null;
    const job = await createGenerationJob(user.id, project.id, {
      type: "image",
      status: "processing",
      ...getProviderJobMetadata(route),
      requestPayload: { prompt, sourceImageUrl },
    });

    if (sourceImageUrl) {
      await addBrandAsset(user.id, project.id, {
        type: "reference_image",
        name: "Source image",
        url: sourceImageUrl,
      });
    }

    const result = sourceImageUrl
      ? await generateReferencedImage({ prompt, imageUrl: sourceImageUrl, language: "en" })
      : await generateSceneImage(prompt, "en");
    await updateGenerationJob(job.id, {
      status: "completed",
      modelKey: result.provider,
      responsePayload: result.responsePayload,
    });

    await saveStoryboard(user.id, project.id, {
      headline: getAppLabel(input.app),
      hook: input.prompt,
      cta: "Use this creative",
      scenes: [
        {
          title: "Generated image",
          narration: "Static image creative generated from the requested direction.",
          visualDirection: prompt,
          overlayText: "",
          durationSeconds: 5,
        },
      ],
    });
    await approveStoryboard(user.id, project.id);
    await saveSceneImage(project.id, 1, result.imageUrl);
    await createOutput(user.id, project.id, {
      type: "scene_image",
      title: `${getAppLabel(input.app)} output`,
      url: result.imageUrl,
    });
    await settleImageCredits(user.id, project.id);
    heldImageCreditsForProject = null;

    return apiSuccess({
      project: { id: project.id, title: project.title, kind: project.kind },
      output: { url: result.imageUrl },
    }, { status: 201 });
  } catch (error) {
    const user = await requireAppUser().catch(() => null);
    if (user && heldImageCreditsForProject) {
      await refundImageCredits(user.id, heldImageCreditsForProject);
    }
    return apiError(error);
  }
}
