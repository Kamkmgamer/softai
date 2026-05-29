import { apiError, apiSuccess, readJson, requireAppUser } from "@/lib/api";
import { burnStoryboardCredits } from "@/lib/credits";
import { assertPromptAllowed } from "@/lib/moderation";
import { multiShotVideoSchema } from "@/lib/validators";
import { addBrandAsset, createOutput, createProject, saveSceneImage, saveStoryboard, approveStoryboard } from "@/lib/store";
import { generateMultiShotStoryboard, buildMultiShotScenesFromCustom } from "@/lib/openrouter";

type SceneInput = {
  title: string;
  narration: string;
  visualDirection: string;
  overlayText: string;
  durationSeconds: number;
};

function parseDurationSeconds(value: string) {
  const seconds = Number.parseInt(value, 10);
  return Number.isFinite(seconds) ? seconds : 10;
}

function distributeDuration(scenes: SceneInput[], duration: string) {
  const totalSeconds = parseDurationSeconds(duration);
  const sceneCount = Math.max(scenes.length, 1);
  const baseSeconds = Math.floor(totalSeconds / sceneCount);
  const remainder = totalSeconds % sceneCount;

  return scenes.map((scene, index) => ({
    ...scene,
    durationSeconds: baseSeconds + (index < remainder ? 1 : 0),
  }));
}

export async function POST(request: Request) {
  try {
    const user = await requireAppUser();
    const input = await readJson(request, multiShotVideoSchema);

    const title =
      input.mode === "auto"
        ? input.prompt.slice(0, 60) + (input.prompt.length > 60 ? "..." : "")
        : input.shots[0]?.prompt.slice(0, 60) + (input.shots[0]?.prompt.length > 60 ? "..." : "");

    assertPromptAllowed(
      input.mode === "auto"
        ? input.prompt
        : input.shots.map((shot) => shot.prompt).join("\n"),
    );

    if (input.mode === "auto") {
      await burnStoryboardCredits(user.id, null);
    }

    const generatedStoryboard = input.mode === "auto"
      ? await generateMultiShotStoryboard({
          prompt: input.prompt,
          language: "en",
        })
      : {
          headline: input.shots[0]?.prompt.slice(0, 100) ?? "Custom sequence",
          hook: input.shots[0]?.prompt ?? "",
          cta: "Generate video",
          scenes: buildMultiShotScenesFromCustom(input.shots),
        };

    const storyboard = {
      ...generatedStoryboard,
      scenes: distributeDuration(generatedStoryboard.scenes, input.duration),
    };

    const project = await createProject(user.id, {
      kind: "multi_shot_video",
      title,
      productName: "Multi-Shot Video",
      offer: "Narrative sequence",
      cta: "Generate video",
      targetAudience: "general",
      brandVoice: "cinematic",
      platformTarget: "tiktok",
      language: "en",
      metadata: {
        app: "multi-shot-video",
        mode: input.mode,
        aspectRatio: input.aspectRatio,
        resolution: input.resolution,
        duration: input.duration,
        audioOn: input.audioOn,
        firstFrameUrl: input.firstFrameUrl ?? null,
      },
      script:
        input.mode === "auto"
          ? input.prompt
          : input.shots.map((s) => s.prompt).join("\n\n"),
    });

    await saveStoryboard(user.id, project.id, {
      headline: storyboard.headline,
      hook: storyboard.hook,
      cta: storyboard.cta,
      scenes: storyboard.scenes,
    });

    if (input.firstFrameUrl) {
      await addBrandAsset(user.id, project.id, {
        type: "reference_image",
        name: "First frame reference",
        url: input.firstFrameUrl,
      });
      await saveSceneImage(project.id, 1, input.firstFrameUrl);
      await createOutput(user.id, project.id, {
        type: "scene_image",
        title: "First frame reference",
        url: input.firstFrameUrl,
      });
    }

    await approveStoryboard(user.id, project.id);

    return apiSuccess({
      project: {
        id: project.id,
        title: project.title,
        kind: project.kind,
      },
      sceneCount: storyboard.scenes.length,
    }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
