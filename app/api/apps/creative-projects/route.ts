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

function readCreativeInput(request: Request) {
  return readJson(request, creativeAppSchema);
}

function titleFromPrompt(prompt: string) {
  return prompt.trim().slice(0, 64) + (prompt.trim().length > 64 ? "..." : "");
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
  return "Edit Studio";
}

function buildImagePrompt(input: Extract<CreativeInput, { app: "text-to-image" | "image-editor" | "expand-image" | "stylize-image" | "product-reshoot" | "vary-image" | "mockup" | "create-ad" }>) {
  if (input.app === "expand-image") {
    return [
      "Expand/outpaint the provided image beyond its current borders.",
      `Expansion direction and content: ${input.prompt}.`,
      `Target aspect ratio: ${input.aspectRatio}.`,
      `Style: ${input.style}.`,
      `Use this source image as the starting point: ${input.sourceImageUrl}. Seamlessly extend the image content, matching lighting, perspective, color palette, and style perfectly.`,
      "The expanded area must look naturally continuous with the original image. Avoid visible seams, abrupt color shifts, or style mismatches.",
      "Avoid embedded text, fake letters, labels, watermarks, captions, UI, or logos.",
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

    await holdImageCredits(user.id, project.id);
    heldImageCreditsForProject = project.id;

    const route = getProviderRoute("image");
    const prompt = buildImagePrompt(input);
    const sourceImageUrl =
      input.app !== "text-to-image"
        ? input.sourceImageUrl
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
