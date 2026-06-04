import { type Locale } from "@/lib/i18n";

export const dictionaries = {
  en: {
    app: {
      dashboard: "Dashboard",
      newProject: "New project",
      library: "Library",
      billing: "Billing",
      payments: "Payments",
      settings: "Settings",
      admin: "Admin",
      brandKit: "Brand Kit",
      history: "History",
      openNavigation: "Open navigation menu",
      closeNavigation: "Close navigation menu",
    },
    shared: {
      backToDashboard: "Back to dashboard",
      dashboard: "Dashboard",
      logIn: "Log in",
      signUp: "Sign up",
      pricing: "Pricing",
      features: "Features",
      whatToCreate: "What do you want to create?",
      searchApps: "Search apps and tools",
      toolsInKit: "Tools in this kit",
      noToolsInKit: "No tools in this kit yet.",
      noToolsMatch: "No tools match that search.",
      credits: "credits",
      plan: "plan",
      openGenerator: "Open generator",
      openFeature: "Open {title}",
      audio: "Audio",
    },
    auth: {
      demoModeHeading: "Demo mode is enabled",
      demoModeDescriptionSignIn:
        "Add Clerk environment variables to enable hosted sign-in. Until then, the app uses a demo session automatically.",
      demoModeDescriptionSignUp:
        "Add Clerk environment variables to enable hosted sign-up. Until then, the app uses a demo session automatically.",
    },
    admin: {
      consoleTitle: "Admin Console",
      reportedAbuse: "Reported abuse",
      recentOutputs: "Recent outputs",
      auditLog: "Audit log",
      users: "Users",
      project: "Project",
      reason: "Reason",
      date: "Date",
      type: "Type",
      url: "URL",
      action: "Action",
      name: "Name",
      email: "Email",
      noReports: "No reports found.",
      takedown: "Takedown",
      banUser: "Ban user",
    },
    pricing: {
      title: "Simple, transparent pricing",
      subtitle: "Pay for the credits you need. No hidden fees.",
      creditEconomics: "Credit economics",
      action: "Action",
      cost: "Cost",
      generateStoryboard: "Generate storyboard",
      storyboardCost: "100 credits",
      renderVideo: "Render final video",
      videoCost: "500 credits",
    },
    dashboard: {
      activeProjects: "active projects",
      completedVideos: "completed videos",
      creditsAvailable: "credits available",
      recentProjects: "Recent projects",
      noProjects: "No projects yet",
      noProjectsDescription:
        "Create your first ad campaign project to get started.",
      updated: "Updated",
    },
    marketing: {
      heroTitle: "One studio for every creative asset your business needs.",
      heroDescription:
        "Generate product photos, ad creatives, social posts, short videos, and educational content from a single dashboard. 26 AI tools, no design skills required.",
      dashboardCta: "Go to Dashboard",
      startCta: "Get started",
      pricingCta: "See pricing",
      statSpeed: "Minutes, not days",
      statFormat: "Platform-ready output",
      statControl: "Your brand, your rules",
      howTitle: "How it works",
      howDescription:
        "Built for business owners who need results, not tutorials. Pick a tool, add your context, and get production-ready assets.",
      stepBriefTitle: "Pick a tool",
      stepBriefDescription:
        "Choose from 26 focused tools: product reshoots, ad creatives, social posts, short videos, carousels, mockups, and more.",
      stepReviewTitle: "Add your context",
      stepReviewDescription:
        "Upload a reference image, describe what you want, and set the format for your target platform.",
      stepRenderTitle: "Generate & export",
      stepRenderDescription:
        "Get your finished asset in seconds. Download, share, or send straight to your ad platform.",
      featuresTitle: "Everything you need to ship",
      storyboardTitle: "AI-powered generation",
      storyboardDescription:
        "Every tool produces production-ready output. Describe what you need in plain language and get campaign-grade images, videos, or social content.",
      safetyTitle: "Your assets stay yours",
      safetyDescription:
        "We never train on your brand assets or generations. Your uploads and outputs are private and secure.",
      avatarsTitle: "Brand consistency",
      avatarsDescription:
        "Upload your brand kit once and every generation stays on-brand. Logos, colors, and voice carry across all tools automatically.",
      heroImageAlt: "Soft-Magic AI dashboard interface",
      storyboardImageAlt: "Storyboard scene editor interface",
      renderingImageAlt: "Rendering progress interface",
      heroOverlay: {
        headline: "Product reshoot for a skincare launch.",
        tags: "Image editor, create ad, social crop",
      },
      heroThumbnails: {
        referenceProduct: "Reference product",
        studioLighting: "Studio lighting",
        shortVideoCut: "Short video cut",
      },
      workflow: {
        step1Title: "Pick a focused tool",
        step1Description:
          "Start from a real production task: image edit, product reshoot, mockup, ad creative, social post, or multi-shot video.",
        step2Title: "Add the product context",
        step2Description:
          "Upload a reference when needed, write the creative direction, then pick the crop that matches the channel.",
        step3Title: "Generate campaign assets",
        step3Description:
          "Open the finished project, review outputs, and keep billing, settings, and exports one click away.",
      },
      tools: {
        heading: "Production-ready tools",
        browseCta: "Browse all tools",
      },
    },
    featuresPage: {
      heroTitle: "Everything you need to ship campaigns.",
      heroDescription:
        "From product photos to finished ads — 26 AI tools organized by what you actually need to do.",
      cta: "Get started",
      pricingCta: "See pricing",
      kitLabel: "Starter Kit",
      allFeatures: "All features",
      forLabel: "Built for",
      marketingAudience: "Small business owners & marketers",
      socialAudience: "Social media managers & content creators",
      filmAudience: "Filmmakers & short-form video creators",
      educationAudience: "Educators & course creators",
      artAudience: "Artists & creative directors",
      imageAudience: "Designers & product photographers",
      videoAudience: "Anyone producing video content",
    },
    library: {
      title: "Library",
      description: "Your finalized campaigns and rendered exports.",
      emptyTitle: "Your library is empty",
      emptyDescription:
        "When your video campaigns finish rendering, they will appear here for download.",
      completed: "Completed",
      view: "View",
      downloadAll: "Download all",
      downloadVideo: "Download video",
      downloadImage: "Download image",
    },
    history: {
      title: "Generation History",
      description: "All images and videos you have generated.",
      emptyTitle: "No generations yet",
      emptyDescription:
        "Your generated media will appear here once you create your first image or video.",
      loadMore: "Load more",
      all: "All",
      images: "Images",
      videos: "Videos",
      download: "Download",
      share: "Share link",
      from: "from",
    },
    billing: {
      title: "Billing",
      description: "Track credits, change plans, and review recent usage.",
      availableCredits: "available credits",
      planActive: "plan active",
      monthlyCredits: "monthly credits",
      renews: "renews",
      topUpCredits: "Plans and credits",
      recentActivity: "Recent activity",
      noActivity: "No activity yet",
      noActivityDescription:
        "Your credit usage and purchases will appear here.",
      creditUpgrade: "plan credit upgrade",
      onboardingCredits: "Onboarding credits",
      monthlyGrant: "Starter plan monthly grant",
      starterStoryboard: "Generated starter storyboard",
      storyboardGeneration: "Storyboard generation",
      imageHold: "Image generation hold",
      imageBurn: "Image generation hold converted to burn",
      imageRefund: "Image generation refund",
      videoHold: "Video generation hold",
      videoBurn: "Video generation hold converted to burn",
      videoRefund: "Video generation refund",
      adminAdjustment: "Admin credit adjustment",
    },
    payments: {
      title: "Payments",
      description:
        "Manage payment methods, invoices, and account billing details.",
      accountPanel: "Payments and invoices",
      billingShortcut: "Need to change plan credits?",
      openBilling: "Open billing",
      handledByClerk:
        "Payment methods, invoices, and billing details open in the billing section below.",
    },
    settings: {
      title: "Settings",
      description:
        "Manage your profile and review account safety expectations.",
      accountProfile: "Account profile",
      trustSafety: "Trust & Safety Policies",
      contentGenerationTitle: "Content generation:",
      contentGeneration:
        "We prohibit the generation of CSAM, non-consensual intimate imagery, violence, and hate speech.",
      avatarsTitle: "Avatars & Likeness:",
      avatars:
        "When uploading single-photo avatars, you must attest to having the rights to that person's likeness. Generation of public figures or politicians is disabled.",
      dataUsageTitle: "Data usage:",
      dataUsage:
        "We do not train foundational models on your private brand assets or generations.",
    },
    projectForm: {
      title: "Project title",
      titlePlaceholder: "e.g. Summer launch push",
      productName: "Product name",
      productNamePlaceholder: "e.g. Glow Serum",
      offer: "Offer",
      offerPlaceholder: "e.g. Buy one, get one free",
      cta: "Call to action",
      ctaPlaceholder: "e.g. Shop now",
      targetAudience: "Target audience",
      targetAudiencePlaceholder: "e.g. busy founders",
      brandVoice: "Brand voice",
      brandVoicePlaceholder: "e.g. clean, energetic",
      platformFormat: "Platform format",
      scriptSeed: "Script seed",
      scriptHint: "Paste your rough sales script or core message.",
      scriptPlaceholder:
        "Introduce the problem, present the product, and give the offer...",
      creating: "Creating project...",
      create: "Create project",
      unableToCreate: "Unable to create project.",
    },
    storyboard: {
      internalTitle: "Internal title",
      narration: "Narration (TTS)",
      visualDirection: "Visual direction",
      overlayText: "Text overlay (optional)",
      cancel: "Cancel",
      saving: "Saving...",
      approve: "Approve and save",
      saveFailed: "Failed to save storyboard.",
      approveFailed: "Failed to approve storyboard.",
    },
    prompts: {
      tone: "Clear, practical SMB marketing language.",
    },
    apps: {
      _form: {
        sourceRequired: "Source",
        sourceOptional: "Optional source",
        dropImage: "Drop source image here",
        dropVideo: "Drop source video here",
        allowedImage: "PNG, JPG, or WebP up to 8MB",
        allowedVideo: "MP4/WebM up to 64MB",
        describeResult: "Describe the result",
        quickTools: "Quick tools",
        generating: "Generating...",
        generate: "Generate",
        generateVideo: "Generate video",
        createEditPlan: "Create edit plan",
        creating: "Creating...",
        uploadNoUrl: "Upload completed, but no URL returned.",
        somethingWrong: "Something went wrong. Please try again.",
        failedToCreate: "Failed to create project.",
        failedToGenerate: "Failed to generate video.",
        uploaded: "{name} uploaded",
        pasteImageUrl: "Paste image URL",
        dropOrClick: "Drop image here, or click to choose",
        firstFrame: "First frame",
        lastFrame: "Last frame",
        generatedMotion: "Generated motion",
        motionDirection: "Motion direction",
        aspectRatio: "Aspect Ratio",
        duration: "Duration",
        resolution: "Resolution",
        platform: "Platform",
        posts: "Posts: {count}",
        slides: "Slides: {count}",
        variants: "Variants: {count}",
        season: "Season",
        audioOn: "On",
        audioOff: "Off",
        auto: "Auto",
        custom: "Custom",
        describeSequence: "Describe your sequence",
        shotList: "Shot list",
        addShot: "Add shot",
        shot: "Shot {n}",
        optionalFirstFrame: "Optional first frame",
        videoWillAppear: "Your generated video will appear here",
        firstFrameRef: "First frame reference",
        sourceRef: "Source reference",
      },
      "text-to-image": {
        title: "Text to Image",
        description:
          "Generate ad-ready image plates from a prompt, with clean space for copy and platform crops.",
        placeholder:
          "A premium skincare bottle on wet black stone, soft morning window light, condensation, warm beige background, clean empty space at top for offer copy.",
        presets: [
          "Product hero",
          "Social ad",
          "Editorial still",
          "Luxury studio",
          "Bold ecommerce",
        ],
      },
      "image-editor": {
        title: "AI Image Editor",
        description:
          "Upload one reference image, then restyle, relight, reshoot, or change the backdrop with a plain-English instruction.",
        placeholder:
          "Keep the product exactly recognizable, replace the background with a warm kitchen counter scene, add golden-hour light, and make it feel like a premium direct-to-consumer ad.",
        presets: [
          "Reshoot product",
          "Change backdrop",
          "Relight scene",
          "Change image style",
          "Remove distractions",
        ],
      },
      "edit-studio": {
        title: "Edit Studio",
        description:
          "Create a practical edit plan for source footage: relight, restyle, remove distractions, or shift the commercial direction.",
        placeholder:
          "Transform this into a high-converting product ad: brighten the product, remove background clutter, add smooth camera motion, make the room feel premium, and end on a clean hero shot.",
        presets: [
          "Transform video",
          "Remove object",
          "Change backdrop",
          "Relight scene",
          "Change time of day",
        ],
      },
      "expand-image": {
        title: "Expand Image",
        description:
          "Upload an image and describe how to extend it beyond its original borders -- add scenery, extend backgrounds, or widen compositions.",
        placeholder:
          "Extend this product photo to the right with a matching marble countertop, soft natural light, and subtle bokeh in the background.",
        presets: [
          "Extend background",
          "Widen composition",
          "Add scenery",
          "Panoramic extend",
          "Fill canvas",
        ],
      },
      "stylize-image": {
        title: "Stylize Image",
        description:
          "Upload any image and transform it into a new artistic style -- watercolor, oil painting, anime, cyberpunk, vintage film, and more.",
        placeholder:
          "Transform this product photo into a warm oil painting style with rich textures, visible brush strokes, and a golden-hour color palette.",
        presets: [
          "Watercolor",
          "Oil painting",
          "Anime",
          "Cyberpunk neon",
          "Vintage film",
          "Pencil sketch",
        ],
      },
      "product-reshoot": {
        title: "Product Reshoot",
        description:
          "Upload your product photo and describe a new setting, lighting, or angle -- get a studio-quality reshoot without the studio.",
        placeholder:
          "Place this product on a rustic wooden table with warm morning sunlight streaming through a window, soft shadows, and a blurred kitchen background.",
        presets: [
          "Studio white",
          "Lifestyle scene",
          "Outdoor natural",
          "Dramatic lighting",
          "Flat lay",
          "Close-up macro",
        ],
      },
      "vary-image": {
        title: "Vary Image",
        description:
          "Upload an image and describe what to change -- swap colors, alter elements, adjust mood, or explore creative directions while keeping the core composition.",
        placeholder:
          "Keep the same product and composition but change the background to a deep navy blue, make the lighting cooler and more dramatic, and add subtle lens flare.",
        presets: [
          "Color swap",
          "Mood shift",
          "Season change",
          "Time of day",
          "Material swap",
          "Background change",
        ],
      },
      mockup: {
        title: "Product Mockup",
        description:
          "Upload a design or logo and describe where it should be placed on a real-world product.",
        placeholder:
          "e.g., A white ceramic coffee mug on a wooden desk with a plant.",
        presets: [
          "Apparel",
          "Print media",
          "Digital screens",
          "Outdoor signage",
        ],
      },
      "create-ad": {
        title: "Create Ad",
        description:
          "Describe the ad you want to create. Optionally upload an existing ad or product photo to generate variations.",
        placeholder:
          "e.g., A bright, highly converting Instagram story ad for a summer skincare line, featuring text 'Summer Sale'.",
        presets: [
          "Headline swap",
          "Color palette change",
          "Product swap",
          "Seasonal theme",
        ],
      },
      "batch-social": {
        title: "Batch Social Generator",
        description:
          "Describe your brand or product and generate a week of platform-specific social posts with matching visuals.",
        placeholder:
          "e.g., A organic skincare brand targeting millennials. Products: vitamin C serum, retinol night cream. Tone: friendly, educational, empowering.",
        presets: [
          "Instagram focus",
          "TikTok trends",
          "LinkedIn professional",
          "Multi-platform",
        ],
      },
      "carousel-builder": {
        title: "Carousel Builder",
        description:
          "Create multi-slide carousel posts for Instagram and LinkedIn. Describe your topic and get a cohesive set of slides.",
        placeholder:
          "e.g., 5 tips for small business owners to improve their social media presence. Include practical, actionable advice.",
        presets: [
          "How-to guide",
          "Data storytelling",
          "Tips & tricks",
          "Case study",
        ],
      },
      "hook-generator": {
        title: "Short-Form Hook Generator",
        description:
          "Generate scroll-stopping hook images for Instagram Reels, TikToks, and YouTube Shorts.",
        placeholder:
          "e.g., A fitness transformation story. Hook should create curiosity about the before/after results.",
        presets: [
          "Curiosity gap",
          "Bold claim",
          "Question hook",
          "Contrarian take",
        ],
      },
      "platform-resizer": {
        title: "Platform Resizer",
        description:
          "Upload an image and adapt it for any social platform. Smart crop and reframe preserve the most important visual elements.",
        placeholder:
          "e.g., Adapt this image for Instagram Reels format while keeping the product centered.",
        presets: [
          "Instagram Reel",
          "TikTok",
          "YouTube Short",
          "LinkedIn",
          "Story format",
        ],
      },
      "lesson-to-video": {
        title: "Lesson to Video",
        description:
          "Describe your lesson topic and key points. The AI will generate a structured teaching video with scenes, visuals, and narration.",
        placeholder:
          "e.g., Introduction to photosynthesis: how plants convert sunlight into energy. Cover the light reactions, Calvin cycle, and real-world applications.",
        presets: [
          "Science lesson",
          "Math concept",
          "History overview",
          "Language tutorial",
        ],
      },
      "explainer-video": {
        title: "Explainer Video Builder",
        description:
          "Create step-by-step explainer videos from a concept description. Perfect for tutorials, onboarding, and educational content.",
        placeholder:
          "e.g., How to set up a Shopify store in 5 steps. Cover account creation, product listing, payment setup, theme customization, and launch.",
        presets: [
          "How-to tutorial",
          "Product demo",
          "Onboarding flow",
          "Concept explainer",
        ],
      },
      "whiteboard-animation": {
        title: "Whiteboard Animation",
        description:
          "Generate whiteboard-style teaching videos from a script. Watch concepts come to life with hand-drawn illustrations.",
        placeholder:
          "e.g., Explaining the water cycle: evaporation, condensation, precipitation, and collection. Simple, visual, and easy to remember.",
        presets: [
          "Classic whiteboard",
          "Colorful sketch",
          "Minimal line art",
          "Story-driven",
        ],
      },
      "course-trailer": {
        title: "Course Trailer",
        description:
          "Create a compelling trailer to promote your online course. Highlight key topics and outcomes to drive enrollments.",
        placeholder:
          "e.g., Complete Digital Marketing Mastery course. Covers SEO, social media ads, email marketing, analytics, and conversion optimization.",
        presets: [
          "Professional promo",
          "Casual & friendly",
          "Urgency-driven",
          "Testimonial style",
        ],
      },
      "style-transfer": {
        title: "Style Transfer",
        description:
          "Upload any image and transform it into a new artistic style. Choose from oil painting, watercolor, anime, cyberpunk, and more.",
        placeholder:
          "Transform this photo into a vibrant watercolor painting with soft edges, flowing colors, and a dreamy atmosphere.",
        presets: [
          "Oil painting",
          "Watercolor",
          "Anime style",
          "Cyberpunk neon",
          "Vintage film",
          "Pencil sketch",
        ],
      },
      "surreal-scene": {
        title: "Surreal Scene Builder",
        description:
          "Generate dreamlike, impossible scenes from text prompts. Push the boundaries of reality with floating objects, ethereal lighting, and fantasy landscapes.",
        placeholder:
          "e.g., A floating city made of crystals above a serene ocean at sunset, with bioluminescent jellyfish drifting between the buildings.",
        presets: [
          "Dreamscape",
          "Impossible geometry",
          "Fantasy world",
          "Sci-fi surrealism",
        ],
      },
      "visual-remix": {
        title: "Visual Remix",
        description:
          "Upload an image and generate multiple styled variations. Reimagine your visuals with bold creative transformations.",
        placeholder:
          "Remix this product photo into a neon-lit cyberpunk version with glowing edges and a futuristic cityscape background.",
        presets: [
          "Neon remix",
          "Vintage reimagined",
          "Abstract art",
          "Pop art style",
        ],
      },
      "loop-generator": {
        title: "Loop Generator",
        description:
          "Create perfect looping visual art for backgrounds, social media, and digital displays.",
        placeholder:
          "e.g., Flowing abstract particles in deep blue and gold, forming organic wave patterns that seamlessly loop.",
        presets: [
          "Fluid waves",
          "Particle flow",
          "Geometric loop",
          "Nature pulse",
        ],
      },
      "script-to-storyboard": {
        title: "Script to Storyboard",
        description:
          "Paste your script and get a full storyboard with scene breakdowns, visual directions, and narration.",
        placeholder:
          "e.g., A 30-second ad for a coffee brand. Scene 1: Morning sunrise over a farm. Scene 2: Hands picking coffee beans. Scene 3: Brewing a perfect cup. Scene 4: Happy customer enjoying the first sip.",
        presets: [
          "30s ad script",
          "60s promo",
          "Product story",
          "Brand narrative",
        ],
      },
      "ab-variants": {
        title: "A/B Variant Generator",
        description:
          "Generate multiple ad variations from one concept. Test different visual approaches to find what converts best.",
        placeholder:
          "e.g., A summer sale ad for a fitness app. Generate variants with different color palettes, focal points, and layouts.",
        presets: [
          "Color test",
          "Layout variants",
          "CTA variations",
          "Audience splits",
        ],
      },
      "seasonal-transform": {
        title: "Seasonal Campaign Transformer",
        description:
          "Upload an existing ad and transform it into a seasonal version. Automatically applies holiday theming while keeping your core message.",
        placeholder:
          "e.g., Transform this ad for the holiday season with warm winter colors, snowflakes, and a gift-giving atmosphere.",
        presets: [
          "Summer vibes",
          "Holiday season",
          "Back to school",
          "Spring refresh",
        ],
      },
      "image-to-video": {
        title: "Image to Video",
        description:
          "Start from a pasted or uploaded image, or lock both start and end frames so the AI only creates the motion between them.",
        heroHeading:
          "Turn a still image into motion without losing the source frame.",
        heroSubtext:
          "Use a product shot as the opening frame, or upload a beginning and ending frame for controlled interpolation.",
        firstFrameMode: "First frame",
        firstFrameModeDesc: "Animate from one image",
        firstLastMode: "First + last",
        firstLastModeDesc: "Fill the in-between",
        motionPlaceholderDual:
          "A smooth premium camera move connects the first product photo to the final hero angle, with subtle light sweeps and no product distortion.",
        motionPlaceholderSingle:
          "The camera slowly pushes in, condensation glints on the bottle, background light drifts softly, product remains sharp and unchanged.",
      },
      "multi-shot-video": {
        title: "Multi-Shot Video",
        description: "Write a simple prompt, get a multiple shots video.",
        heroHeading: "Multi-Shot Video",
        heroSubtext: "Write a simple prompt, get a multiple shots video.",
        autoPlaceholder:
          "A lone astronaut walks across a vast red desert under a pink sky. She stops, kneels, and picks up a glowing object half-buried in the sand. Close-up on her face as she looks up, a massive structure emerges from the dust on the horizon.",
        openingShot: "Opening shot: the character enters the scene...",
        finalShot: "Final shot: the reveal, the payoff...",
        describeShot: "Describe shot {n}...",
      },
    },
    features: {
      "edit-studio": {
        title: "Edit Studio",
        description:
          "Transform a video with natural-language edits for lighting, style, objects, or pacing.",
      },
      "multi-shot-video": {
        title: "Multi-Shot Video",
        description: "Write a simple prompt, get a multiple shots video.",
      },
      "scene-builder": {
        title: "Scene Builder",
        description:
          "Craft your multi-shot scene step by step, see the look, then bring it to life.",
      },
      "upscale-video": {
        title: "Upscale Video",
        description: "Upscale video with Topaz AI.",
      },
      "performance-capture": {
        title: "Performance Capture with Act-Two",
        description: "Animate characters using driving performance videos.",
      },
      "remove-from-video": {
        title: "Remove from Video",
        description: "Remove objects without reshooting.",
      },
      "product-shot-video": {
        title: "Product Shot Video Builder",
        description: "Turn a product photo into a polished video ad.",
      },
      "text-to-image": {
        title: "Text to Image",
        description: "Generate campaign-ready image plates from a prompt.",
      },
      "image-editor": {
        title: "AI Image Editor",
        description:
          "Restyle, reshoot, relight, or change backdrops from one reference image.",
      },
      "image-to-video": {
        title: "Image to Video",
        description: "Animate one image or bridge first and last frames.",
      },
      "expand-image": {
        title: "Expand Image",
        description: "Extend an image beyond its original frame.",
      },
      "stylize-image": {
        title: "Stylize Image",
        description:
          "Apply artistic styles to your image -- watercolor, oil painting, anime, vintage, and more.",
      },
      "product-reshoot": {
        title: "Product Reshoot",
        description:
          "Instantly change the setting, lighting, or angle of your product photo.",
      },
      "vary-image": {
        title: "Vary Image",
        description:
          "Generate creative variations of your image -- change elements while keeping the core composition.",
      },
      mockup: {
        title: "Mockup Generator",
        description:
          "Place your design on real-world products -- apparel, mugs, screens, signage.",
      },
      "create-ad": {
        title: "Create Ad",
        description:
          "Generate ad creatives from scratch or variations of an existing ad.",
      },
      "batch-social": {
        title: "Batch Social Generator",
        description:
          "Generate a week of platform-specific social posts from one idea.",
      },
      "carousel-builder": {
        title: "Carousel Builder",
        description:
          "Create multi-slide carousel posts for Instagram and LinkedIn.",
      },
      "hook-generator": {
        title: "Short-Form Hook Generator",
        description: "Generate viral hook variations for Reels and TikToks.",
      },
      "platform-resizer": {
        title: "Platform Resizer",
        description:
          "Adapt any image to fit every social platform's dimensions.",
      },
      "lesson-to-video": {
        title: "Lesson to Video",
        description:
          "Turn lesson plans into structured teaching videos with scenes and visuals.",
      },
      "explainer-video": {
        title: "Explainer Video Builder",
        description:
          "Create step-by-step explainer videos from a concept description.",
      },
      "whiteboard-animation": {
        title: "Whiteboard Animation",
        description: "Generate whiteboard-style teaching videos from a script.",
      },
      "course-trailer": {
        title: "Course Trailer",
        description:
          "Create a compelling trailer to promote your online course.",
      },
      "style-transfer": {
        title: "Style Transfer",
        description:
          "Transform any image into a new artistic style -- oil painting, anime, cyberpunk, and more.",
      },
      "surreal-scene": {
        title: "Surreal Scene Builder",
        description: "Generate dreamlike, impossible scenes from text prompts.",
      },
      "visual-remix": {
        title: "Visual Remix",
        description: "Upload an image and generate multiple styled variations.",
      },
      "loop-generator": {
        title: "Loop Generator",
        description:
          "Create perfect looping visual art for backgrounds and social.",
      },
      "script-to-storyboard": {
        title: "Script to Storyboard",
        description:
          "Paste a script and get a full storyboard with scene breakdowns.",
      },
      "ab-variants": {
        title: "A/B Variant Generator",
        description:
          "Generate multiple ad variations from one concept to test.",
      },
      "seasonal-transform": {
        title: "Seasonal Campaign Transformer",
        description:
          "Transform an existing ad into a seasonal version automatically.",
      },
      "text-to-speech": {
        title: "Text to Speech",
        description: "Generate spoken audio from text.",
      },
      "lip-sync": {
        title: "Lip Sync",
        description: "Sync speech to a character or performance.",
      },
      "custom-agent": {
        title: "Custom Agent",
        description:
          "Create a custom assistant for repeatable creative workflows.",
      },
      "model-library": {
        title: "Model Library",
        description: "Choose generation models and compare capabilities.",
      },
    },
  },
  ar: {
    app: {
      dashboard: "لوحة التحكم",
      newProject: "مشروع جديد",
      library: "المكتبة",
      billing: "الفوترة",
      payments: "المدفوعات",
      settings: "الإعدادات",
      admin: "الإدارة",
      brandKit: "الهوية البصرية",
      history: "السجل",
      openNavigation: "افتح قائمة التنقل",
      closeNavigation: "أغلق قائمة التنقل",
    },
    shared: {
      backToDashboard: "العودة إلى لوحة التحكم",
      dashboard: "لوحة التحكم",
      logIn: "تسجيل الدخول",
      signUp: "ابدأ الآن",
      pricing: "الأسعار",
      features: "الميزات",
      whatToCreate: "ماذا تريد أن تنشئ؟",
      searchApps: "ابحث عن التطبيقات والأدوات",
      toolsInKit: "أدوات في هذه المجموعة",
      noToolsInKit: "لا توجد أدوات في هذه المجموعة بعد.",
      noToolsMatch: "لا تتطابق أي أدوات مع هذا البحث.",
      credits: "رصيد",
      plan: "خطة",
      openGenerator: "فتح المولّد",
      openFeature: "فتح {title}",
      audio: "الصوت",
    },
    auth: {
      demoModeHeading: "الوضع التجريبي مفعّل",
      demoModeDescriptionSignIn:
        "أضف متغيرات بيئة Clerk لتفعيل تسجيل الدخول المُستضاف. في هذه الأثناء، يستخدم التطبيق جلسة تلقائية تجريبية.",
      demoModeDescriptionSignUp:
        "أضف متغيرات بيئة Clerk لتفعيل التسجيل المُستضاف. في هذه الأثناء، يستخدم التطبيق جلسة تجريبية تلقائية.",
    },
    admin: {
      consoleTitle: "لوحة الإدارة",
      reportedAbuse: "بلاغات الإساءة",
      recentOutputs: "المخرجات الأخيرة",
      auditLog: "سجل المراجعة",
      users: "المستخدمون",
      project: "المشروع",
      reason: "السبب",
      date: "التاريخ",
      type: "النوع",
      url: "الرابط",
      action: "الإجراء",
      name: "الاسم",
      email: "البريد الإلكتروني",
      noReports: "لا توجد بلاغات.",
      takedown: "إزالة",
      banUser: "حظر المستخدم",
    },
    pricing: {
      title: "أسعار واضحة وبسيطة",
      subtitle: "ادفع مقابل الرصيد الذي تحتاجه. لا توجد رسوم خفية.",
      creditEconomics: "اقتصاديات الرصيد",
      action: "الإجراء",
      cost: "التكلفة",
      generateStoryboard: "توليد ستوري بورد",
      storyboardCost: "100 رصيد",
      renderVideo: "تصدير الفيديو النهائي",
      videoCost: "500 رصيد",
    },
    dashboard: {
      activeProjects: "مشاريع نشطة",
      completedVideos: "فيديوهات مكتملة",
      creditsAvailable: "رصيد متاح",
      recentProjects: "أحدث المشاريع",
      noProjects: "لا توجد مشاريع بعد",
      noProjectsDescription: "أنشئ أول حملة إعلانية وابدأ من هنا.",
      updated: "آخر تحديث",
    },
    marketing: {
      heroTitle: "استوديو واحد لكل ما يحتاجه عملك الإبداعي.",
      heroDescription:
        "ولّد صور منتجات، إعلانات إبداعية، منشورات سوشيال، فيديوهات قصيرة، ومحتوى تعليمي من لوحة تحكم واحدة. 26 أداة ذكاء اصطناعي، بدون مهارات تصميم.",
      dashboardCta: "اذهب إلى لوحة التحكم",
      startCta: "ابدأ الآن",
      pricingCta: "عرض الأسعار",
      statSpeed: "دقائق لا أيام",
      statFormat: "مخرجات جاهزة للمنصات",
      statControl: "علامتك، قواعدك",
      howTitle: "كيف يعمل؟",
      howDescription:
        "مصمّم لأصحاب الأعمال الذين يحتاجون نتائج، ليس دروساً. اختر أداة، أضف سياقك، واحصل على أصول جاهزة للإنتاج.",
      stepBriefTitle: "اختر أداة",
      stepBriefDescription:
        "اختر من 26 أداة مُركّزة: إعادة تصوير منتج، إعلانات إبداعية، منشورات سوشيال، فيديوهات قصيرة، كاروسيلات، موك أب والمزيد.",
      stepReviewTitle: "أضف سياقك",
      stepReviewDescription:
        "ارفع صورة مرجعية، صف ما تريد، واختر الصيغة المناسبة للمنصة المستهدفة.",
      stepRenderTitle: "ولّد وصدّر",
      stepRenderDescription:
        "احصل على أصولك المكتملة في ثوانٍ. حمّل أو شارك أو أرسل مباشرة إلى منصة الإعلان.",
      featuresTitle: "كل ما تحتاجه لإطلاق الحملات",
      storyboardTitle: "توليد بالذكاء الاصطناعي",
      storyboardDescription:
        "كل أداة تنتج مخرجات جاهزة للإنتاج. صف ما تحتاجه بسيطة واحصل على صور أو فيديو أو محتوى سوشيال بجودة الحملات الإعلانية.",
      safetyTitle: "أصولك تبقى خاصة بك",
      safetyDescription:
        "لا نستخدم أصول علامتك أو مخرجاتك أبداً لتدريب النماذج. رفعاتك ومخرجاتك خاصة وآمنة.",
      avatarsTitle: "استمرارية العلامة",
      avatarsDescription:
        "ارفع هوية علامتك مرة واحدة وستبقى كل التوليدات متوافقة معها. الشعارات والألوان والنبرة تنتقل تلقائياً عبر جميع الأدوات.",
      heroImageAlt: "واجهة لوحة تحكم Soft-Magic AI",
      storyboardImageAlt: "واجهة تحرير مشاهد الستوري بورد",
      renderingImageAlt: "واجهة تقدم التوليد",
      heroOverlay: {
        headline: "إعادة تصوير منتج لخط عناية بالبشرة.",
        tags: "محرر صور، إنشاء إعلان، قص للسوشيال",
      },
      heroThumbnails: {
        referenceProduct: "صورة المنتج المرجعية",
        studioLighting: "إضاءة الاستوديو",
        shortVideoCut: "قصة فيديو قصيرة",
      },
      workflow: {
        step1Title: "اختر أداة مُركّزة",
        step1Description:
          "ابدأ من مهمة إنتاج حقيقية: تحرير صورة، إعادة تصوير منتج، موك أب، إعلان إبداعي، منشور سوشيال، أو فيديو متعدد المشاهد.",
        step2Title: "أضف سياق المنتج",
        step2Description:
          "ارفع صورة مرجعية عند الحاجة، اكتب التوجيه الإبداعي، ثم اختر الصيغة المناسبة للقناة.",
        step3Title: "ولّد أصول الحملة",
        step3Description:
          "افتح المشروع المكتمل، راجع المخرجات، واحتفظ بالفوترة والإعدادات والتصدير بنقرة واحدة.",
      },
      tools: {
        heading: "أدوات جاهزة للإنتاج",
        browseCta: "تصفح جميع الأدوات",
      },
    },
    featuresPage: {
      heroTitle: "كل ما تحتاجه لإطلاق الحملات.",
      heroDescription:
        "من صور المنتجات إلى الإعلانات النهائية — 26 أداة ذكاء اصطناعي مصنّفة حسب ما تحتاج فعله فعلاً.",
      cta: "ابدأ الآن",
      pricingCta: "عرض الأسعار",
      kitLabel: "مجموعة أدوات",
      allFeatures: "جميع الميزات",
      forLabel: "مصمّم لـ",
      marketingAudience: "أصحاب الأعمال الصغيرة والمسوّقون",
      socialAudience: "مدراء السوشيال ومصنعو المحتوى",
      filmAudience: "صانعو الأفلام ومحتوى الفيديو القصير",
      educationAudience: "المعلمون ومصنعو الدورات",
      artAudience: "الفنانون والمديرون الإبداعيون",
      imageAudience: "المصممون ومصورو المنتجات",
      videoAudience: "أي شخص ينتج محتوى فيديو",
    },
    library: {
      title: "المكتبة",
      description: "حملاتك المكتملة والملفات الجاهزة للتصدير.",
      emptyTitle: "المكتبة فارغة حالياً",
      emptyDescription:
        "عند اكتمال عرض حملات الفيديو، ستظهر هنا لتتمكن من تنزيلها.",
      completed: "اكتمل",
      view: "عرض",
      downloadAll: "تنزيل الكل",
      downloadVideo: "تنزيل الفيديو",
      downloadImage: "تنزيل الصورة",
    },
    history: {
      title: "سجل التوليد",
      description: "جميع الصور ومقاطع الفيديو التي قمت بتوليدها.",
      emptyTitle: "لا توجد عمليات توليد بعد",
      emptyDescription:
        "ستظهر وسائطك المولّدة هنا بمجرد إنشاء أول صورة أو فيديو.",
      loadMore: "تحميل المزيد",
      all: "الكل",
      images: "الصور",
      videos: "مقاطع الفيديو",
      download: "تنزيل",
      share: "مشاركة رابط",
      from: "من",
    },
    billing: {
      title: "الفوترة",
      description: "تابع الرصيد، وعدّل الخطة، وراجع آخر استخدام للرصيد.",
      availableCredits: "رصيد متاح",
      planActive: "خطة مفعّلة",
      monthlyCredits: "رصيد شهري",
      renews: "يتجدد في",
      topUpCredits: "الخطط والرصيد",
      recentActivity: "آخر العمليات",
      noActivity: "لا توجد عمليات بعد",
      noActivityDescription: "سيظهر هنا استخدام الرصيد والمشتريات.",
      creditUpgrade: "ترقية رصيد الخطة",
      onboardingCredits: "رصيد البداية",
      monthlyGrant: "رصيد خطة البداية الشهري",
      starterStoryboard: "تم إنشاء ستوري بورد أولي",
      storyboardGeneration: "توليد الستوري بورد",
      imageHold: "حجز رصيد توليد الصور",
      imageBurn: "تحويل حجز توليد الصور إلى خصم نهائي",
      imageRefund: "استرجاع رصيد توليد الصور",
      videoHold: "حجز رصيد توليد الفيديو",
      videoBurn: "تحويل حجز توليد الفيديو إلى خصم نهائي",
      videoRefund: "استرجاع رصيد توليد الفيديو",
      adminAdjustment: "تعديل رصيد من الإدارة",
    },
    payments: {
      title: "المدفوعات",
      description: "إدارة طرق الدفع والفواتير وبيانات الحساب المالية.",
      accountPanel: "المدفوعات والفواتير",
      billingShortcut: "تحتاج إلى تغيير رصيد الخطة؟",
      openBilling: "افتح الفوترة",
      handledByClerk:
        "تفتح طرق الدفع والفواتير وبيانات الفوترة في قسم الفوترة أدناه.",
    },
    settings: {
      title: "الإعدادات",
      description: "إدارة ملفك ومراجعة توقعات أمان الحساب.",
      accountProfile: "ملف الحساب",
      trustSafety: "سياسات الثقة والسلامة",
      contentGenerationTitle: "توليد المحتوى:",
      contentGeneration:
        "نمنع توليد محتوى استغلال الأطفال، أو الصور الحميمة غير المتفق عليها، أو العنف، أو خطاب الكراهية.",
      avatarsTitle: "الشخصيات والحقوق:",
      avatars:
        "عند رفع صورة شخصية واحدة، يجب أن تؤكد امتلاكك حق استخدام ملامح ذلك الشخص. توليد الشخصيات العامة أو السياسيين غير مفعّل.",
      dataUsageTitle: "استخدام البيانات:",
      dataUsage:
        "لا نستخدم أصول علامتك الخاصة أو المخرجات لتدريب النماذج الأساسية.",
    },
    projectForm: {
      title: "عنوان المشروع",
      titlePlaceholder: "مثال: حملة إطلاق الصيف",
      productName: "اسم المنتج",
      productNamePlaceholder: "مثال: سيروم جلو",
      offer: "العرض",
      offerPlaceholder: "مثال: اشتر واحداً واحصل على الثاني مجاناً",
      cta: "الدعوة لاتخاذ إجراء",
      ctaPlaceholder: "مثال: اطلب الآن",
      targetAudience: "الجمهور المستهدف",
      targetAudiencePlaceholder: "مثال: أصحاب المتاجر المشغولون",
      brandVoice: "نبرة العلامة",
      brandVoicePlaceholder: "مثال: بسيطة، ودودة، وحيوية",
      platformFormat: "صيغة المنصة",
      scriptSeed: "مسودة النص",
      scriptHint: "اكتب فكرتك الأساسية أو رسالة البيع كما تشرحها لفريقك.",
      scriptPlaceholder: "اشرح المشكلة، قدّم المنتج، ثم اذكر العرض بوضوح...",
      creating: "جار إنشاء المشروع...",
      create: "إنشاء المشروع",
      unableToCreate: "تعذر إنشاء المشروع.",
    },
    storyboard: {
      internalTitle: "عنوان داخلي",
      narration: "النص الصوتي",
      visualDirection: "توجيه المشهد",
      overlayText: "النص الظاهر على الفيديو",
      cancel: "إلغاء",
      saving: "جار الحفظ...",
      approve: "اعتماد وحفظ",
      saveFailed: "تعذر حفظ الستوري بورد.",
      approveFailed: "تعذر اعتماد الستوري بورد.",
    },
    prompts: {
      tone: "استخدم عربية فصحى سهلة وطبيعية، قريبة من لغة أصحاب الأعمال، من دون رسمية زائدة أو عبارات متكلفة.",
    },
    apps: {
      _form: {
        sourceRequired: "المصدر",
        sourceOptional: "مصدر اختياري",
        dropImage: "اسحب صورة المصدر هنا",
        dropVideo: "اسحب فيديو المصدر هنا",
        allowedImage: "PNG، JPG، أو WebP حتى 8MB",
        allowedVideo: "MP4/WebM حتى 64MB",
        describeResult: "صف النتيجة",
        quickTools: "أدوات سريعة",
        generating: "جارٍ التوليد...",
        generate: "توليد",
        generateVideo: "توليد فيديو",
        createEditPlan: "إنشاء خطة تحرير",
        creating: "جارٍ الإنشاء...",
        uploadNoUrl: "اكتمل الرفع، لكن لم يتم إرجاع رابط.",
        somethingWrong: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
        failedToCreate: "فشل إنشاء المشروع.",
        failedToGenerate: "فشل توليد الفيديو.",
        uploaded: "{name} تم الرفع",
        pasteImageUrl: "الصق رابط الصورة",
        dropOrClick: "اسحب الصورة هنا، أو انقر للاختيار",
        firstFrame: "الإطار الأول",
        lastFrame: "الإطار الأخير",
        generatedMotion: "الحركة المولّدة",
        motionDirection: "اتجاه الحركة",
        aspectRatio: "نسبة العرض",
        duration: "المدة",
        resolution: "الدقة",
        platform: "المنصة",
        posts: "منشورات: {count}",
        slides: "شرائح: {count}",
        variants: "نسخ: {count}",
        season: "الفصل",
        audioOn: "الصوت مفعّل",
        audioOff: "الصوت معطّل",
        auto: "تلقائي",
        custom: "مخصص",
        describeSequence: "صف التسلسل",
        shotList: "قائمة اللقطات",
        addShot: "إضافة لقطة",
        shot: "لقطة {n}",
        optionalFirstFrame: "إطار أول اختياري",
        videoWillAppear: "فيديوك المولّد سيظهر هنا",
        firstFrameRef: "مرجع الإطار الأول",
        sourceRef: "مرجع المصدر",
      },
      "text-to-image": {
        title: "نص إلى صورة",
        description:
          "ولّد صوراً إعلانية جاهزة من وصف نصي، مع مساحة نظيفة للنصوص وقصص المنصات.",
        placeholder:
          "زجاجة عناية بالبشرة فاخرة على حجر أسود رطب، إضاءة نافذة صباحية ناعمة، تكاثف، خلفية بيج دافئة، مساحة فارغة في الأعلى لنص العرض.",
        presets: [
          "بطل المنتج",
          "إعلان سوشيال",
          "صورة تحريرية",
          "ستوديو فاخر",
          "تجارة إلكترونية جريئة",
        ],
      },
      "image-editor": {
        title: "محرر صور بالذكاء الاصطناعي",
        description:
          "ارفع صورة مرجعية واحدة، ثم أعد التصميم أو الإضاءة أو التصوير أو غيّر الخلفية بتعليمات بسيطة.",
        placeholder:
          "حافظ على تعرّف المنتج بالضبط، استبدل الخلفية بم scene مطبخ دافئ، أضف إضاءة الساعة الذهبية، واجعلها تبدو كإعلان ممتاز للمستهلك المباشر.",
        presets: [
          "إعادة تصوير المنتج",
          "تغيير الخلفية",
          "إعادة الإضاءة",
          "تغيير نمط الصورة",
          "إزالة المشتتات",
        ],
      },
      "edit-studio": {
        title: "استوديو التحرير",
        description:
          "أنشئ خطة تحرير عملية للfootage: أعد الإضاءة، أعد التصميم، أزل المشتتات، أو غيّر الاتجاه التجاري.",
        placeholder:
          "حوّل هذا إلى إعلان منتج عالي التحويل: سطّر المنتج، أزل فوضى الخلفية، أضف حركة كاميرا سلسة، اجعل الغرفة تبدو فاخرة، وانتهي على لقطة بطل نظيفة.",
        presets: [
          "تحويل الفيديو",
          "إزالة عنصر",
          "تغيير الخلفية",
          "إعادة الإضاءة",
          "تغيير الوقت",
        ],
      },
      "expand-image": {
        title: "توسيع الصورة",
        description:
          "ارفع صورة وصف كيفية توسيعها تجاوز حدودها الأصلية -- أضف مشاهد، وسّع الخلفيات، أو اعرض التكوينات.",
        placeholder:
          "وسّع صورة المنتج هذه إلى اليمين مع عداد رخامي متطابق، إضاءة طبيعية ناعمة، وعمق ميدان ضبابي في الخلفية.",
        presets: [
          "توسيع الخلفية",
          "توسيع التكوين",
          "إضافة مشاهد",
          "توسيع بانورامي",
          "ملء اللوحة",
        ],
      },
      "stylize-image": {
        title: "تجميل الصورة",
        description:
          "ارفع أي صورة وحوّلها إلى نمط فني جديد -- ألوان مائية، زيت، أنمي، سايبربانك، فيلم كلاسيكي، والمزيد.",
        placeholder:
          "حوّل صورة المنتج هذه إلى نمط لوحة زيتية دافئة مع نسيج غني، ضربات فرشاة مرئية، و لوحة ألوان الساعة الذهبية.",
        presets: [
          "ألوان مائية",
          "لوحة زيتية",
          "نمط أنمي",
          "نيون سايبربانك",
          "فيلم كلاسيكي",
          "رسم قلم رصاص",
        ],
      },
      "product-reshoot": {
        title: "إعادة تصوير المنتج",
        description:
          "ارفع صورة منتجك وصف إعداداً جديداً أو إضاءة أو زاوية -- احصل على إعادة تصوير بجودة الاستوديو بدون الاستوديو.",
        placeholder:
          "ضع هذا المنتج على طاولة خشبية ريفية مع أشعة شمس صباحية دافئة تتدفق من النافذة، ظلال ناعمة، وخلفية مطبخ ضبابية.",
        presets: [
          "استوديو أبيض",
          "مشهد نمط حياة",
          "طبيعة في الخارج",
          "إضاءة درامية",
          "عرض مسطح",
          "لقطة ماكرو قريبة",
        ],
      },
      "vary-image": {
        title: "تنويع الصورة",
        description:
          "ارفع صورة وصف ما تريد تغييره -- غيّر الألوان، عدّل العناصر، اضبط المزاج، أو استكشف اتجاهات إبداعية مع الحفاظ على التكوين الأساسي.",
        placeholder:
          "حافظ على نفس المنتج والتكوين لكن استبدل الخلفية بأزرق ناوي عميق، جعل الإضاءة أبرد وأكثر درامية، وأضف وهج عدسة خفيف.",
        presets: [
          "تبديل الألوان",
          "تغيير المزاج",
          "تغيير الموسم",
          "تغيير الوقت",
          "تبديل المادة",
          "تغيير الخلفية",
        ],
      },
      mockup: {
        title: "مولّد الموك أب",
        description: "ارفع تصميم أو شعار وصف مكان وضعه على منتج حقيقي.",
        placeholder: "مثال: كوب قهوة أبيض من السيراميك على طاولة خشبة مع نبتة.",
        presets: ["ملابس", "وسائط مطبوعة", "شاشات رقمية", "لافتات خارجية"],
      },
      "create-ad": {
        title: "إنشاء إعلان",
        description:
          "صف الإعلان الذي تريد إنشاءه. يمكنك رفع إعلان أو صورة منتج موجودة لتوليد نسخ متنوعة.",
        placeholder:
          "مثال: إعلان Instagram story مشرق وعاليم التحويل لخط عناية بالبشرة صيفي، مع نص 'عرض الصيف'.",
        presets: [
          "تبديل العنوان",
          "تغيير لوحة الألوان",
          "تبديل المنتج",
          "سمة موسمية",
        ],
      },
      "batch-social": {
        title: "مولّد السوشيال بالجملة",
        description:
          "صف علامتك التجارية أو منتجك وولّد أسبوعاً من منشورات السوشيال المخصصة للمنصات مع مرئيات متطابقة.",
        placeholder:
          "مثال: علامة تجارية عضوية للعناية بالبشرة تستهدف جيل الألفية. المنتجات: سيروم فيتامين سي، كريم ليل الريتينول. النبرة: ودودة، تعليمية، ممكّنة.",
        presets: [
          "تركيز إنستغرام",
          "اتجاهات تيك توك",
          "لينكدإن المهني",
          "متعدد المنصات",
        ],
      },
      "carousel-builder": {
        title: "منشئ الكاروسيل",
        description:
          "أنشئ منشورات كاروسيل متعددة الشرائح لإنستغرام ولينكدإن. صف موضوعك واحصل على مجموعة متماسكة من الشرائح.",
        placeholder:
          "مثال: 5 نصائح لأصحاب الأعمال الصغيرة لتحسين حضورهم على وسائل التواصل الاجتماعي. قدم نصائح عملية وقابلة للتنفيذ.",
        presets: ["دليل كيف", "سرد البيانات", "نصائح وأ Tricks", "دراسة حالة"],
      },
      "hook-generator": {
        title: "مولّد الخطافات القصيرة",
        description:
          "ولّد صور خطافات توقف التمرير لـ Reels وTikToks وYouTube Shorts.",
        placeholder:
          "مثال: قصة تحول لياقة بدنية. الخطاف يجب أن يثير الفضول حول نتائج قبل/بعد.",
        presets: ["فجوة الفضول", "ادعاء جريء", "خطاف سؤال", "وجهة نظر معارضة"],
      },
      "platform-resizer": {
        title: "مُعدّل المنصات",
        description:
          "ارفع صورة وكيّفها لأي منصة سوشيال. القص الذكي وإعادة الإطار يحافظان على أهم العناصر البصرية.",
        placeholder:
          "مثال: كيّف هذه الصورة لصيغة Instagram Reels مع الحفاظ على المنتج في المركز.",
        presets: [
          "Instagram Reel",
          "TikTok",
          "YouTube Short",
          "LinkedIn",
          "صيغة Story",
        ],
      },
      "lesson-to-video": {
        title: "درس إلى فيديو",
        description:
          "صف موضوع درسك والنقاط الرئيسية. سيولّد الذكاء الاصطناعي فيديو تعليمي منظماً مع مشاهد ومرئيات وتعليق صوتي.",
        placeholder:
          "مثال: مقدمة في عملية البناء الضوئية: كيف تحوّل النباتات ضوء الشمس إلى طاقة. غطّي التفاعلات الضوئية، دورة كلفن، والتطبيقات الواقعية.",
        presets: ["درس علوم", "مفهوم رياضيات", "نظرة تاريخية", "درس لغة"],
      },
      "explainer-video": {
        title: "فيديو شرح",
        description:
          "أنشئ فيديوهات شرح خطوة بخطوة من وصف مفهوم. مثالية للدروس وال تعريف والتعليم.",
        placeholder:
          "مثال: كيفية إعداد متجر Shopify في 5 خطوات. غطّي إنشاء الحساب، وصف المنتجات، إعداد الدفع، تخصيص السمة، والإطلاق.",
        presets: ["tutorial كيف", "عرض المنتج", "سير التعريف", "شرح المفهوم"],
      },
      "whiteboard-animation": {
        title: "رسوم متحركة على السبورة",
        description:
          "ولّد فيديوهات تعليمية على نمط السبورة البيضاء من نص. شاهد المفاهيم تتحول إلى حياة برسم يدوي.",
        placeholder:
          "مثال: شرح دورة المياه: التبخر، التكثف، الهطول، والتجميع. بسيط، بصري، وسهل التذكر.",
        presets: [
          "سبورة كلاسيكية",
          "رسم ملوّن",
          "رسم خطي بسيط",
          "قائم على قصة",
        ],
      },
      "course-trailer": {
        title: "إعلان الدورة",
        description:
          "إنشاء إعلان جذاب للترويج لدورةك الإلكترونية. أبرز الموضوعات الرئيسية والنتائج لزيادة التسجيلات.",
        placeholder:
          "مثال: دورة إتقان التسويق الرقمي الشاملة. تغطي SEO، إعلانات وسائل التواصل، التسويق بالبريد الإلكتروني، التحليلات، وتحسين معدلات التحويل.",
        presets: ["ترويج احترافي", "ودود وعفوي", "إلحاح", "أسلوب الشهادات"],
      },
      "style-transfer": {
        title: "نقل الأسلوب",
        description:
          "ارفع أي صورة وحوّلها إلى نمط فني جديد. اختر من لوحة زيتية، ألوان مائية، أنمي، سايبربانك، والمزيد.",
        placeholder:
          "حوّل هذه الصورة إلى لوحة مائية نابضة بالحياة مع حواف ناعمة، ألوان دافقة، أجواء حالمية.",
        presets: [
          "لوحة زيتية",
          "ألوان مائية",
          "نمط أنمي",
          "نيون سايبربانك",
          "فيلم كلاسيكي",
          "رسم قلم رصاص",
        ],
      },
      "surreal-scene": {
        title: "منشئ المشاهد السريالية",
        description:
          "ولّد مشاهد أحلام مستحيلة من أوصاف نصية. تجاوز حدود الواقع مع عناصر طائمة، إضاءة أثيرية، ومناظر طبيعية خيالية.",
        placeholder:
          "مثال: مدينة طائمة من الكريستال فوق محيط هادئ عند الغروب، مع قناديل بحر مضيئة تتأرجح بين المباني.",
        presets: [
          "عالم أحلام",
          "هندسة مستحيلة",
          "عالم خيالي",
          "سايبربانك سريالي",
        ],
      },
      "visual-remix": {
        title: "ريمكس بصري",
        description:
          "ارفع صورة وولّد نسخاً متنوعة بأساليب مختلفة. أعد تصوير مرئياتك بتحويلات إبداعية جريئة.",
        placeholder:
          "حوّل صورة المنتج هذه إلى نسخة سايبربانك مضاءة بالنيون مع حواف متوهجة وخلفية مدينة مستقبلية.",
        presets: [
          "ريمكس نيون",
          "إعادة تخيل كلاسيكية",
          "فن تجريد",
          "نمط البوب آرت",
        ],
      },
      "loop-generator": {
        title: "مولّد الحلقات",
        description:
          "أنشئ فن بصري مثالي التكرار للخلفيات ووسائل التواصل والشاشات الرقمية.",
        placeholder:
          "مثال: جزيئات تجريدية دافقة في أزرق وذهبي، تشكل أنماط أمواج عضوية تتكرر بسلاسة.",
        presets: ["أمواج دافقة", "تدفق جزيئات", "حلقة هندسية", "نبض الطبيعة"],
      },
      "script-to-storyboard": {
        title: "نص إلى ستوري بورد",
        description:
          "الصق نصك واحصل على ستوري بورد كامل مع تحليل المشاهد، التوجيهات البصرية، والتعليق الصوتي.",
        placeholder:
          "مثال: إعلان 30 ثانية لعلامة قهوة. المشهد 1: شروق الشمس على مزرعة. المشهد 2: يدאן تقطفان حبوب القهوة. المشهد 3: تحضير كوب مثالي. المشهد 4: عميل سعيد يستمتع بأول رشفة.",
        presets: [
          "نص إعلان 30 ثانية",
          "إعلان 60 ثانية",
          "قصة المنتج",
          "سرد العلامة",
        ],
      },
      "ab-variants": {
        title: "مولّد اختبار A/B",
        description:
          "ولّد نسخاً متنوعة من إعلان واحد. اختبر مناهج بصرية مختلفة لتجد ما يحقق أفضل تحويل.",
        placeholder:
          "مثال: إعلان عرض صيفي لتطبيق لياقة. ولّد نسخاً بألوان ونقاط تركيز وتنسيقات مختلفة.",
        presets: [
          "اختبار الألوان",
          "تنويعات التخطيط",
          "تنويعات CTA",
          "تقسيم الجمهور",
        ],
      },
      "seasonal-transform": {
        title: "محوّل الحملات الموسمية",
        description:
          "ارفع إعلاناً موجوداً وحوّله إلى نسخة موسمية. يُطبّق سمة العطلات تلقائياً مع الحفاظ على رسالتك الأساسية.",
        placeholder:
          "مثال: حوّل هذا الإعلان لموسم العطلات بألوان شتوية دافئة، ثلج، وأجواء تقديم الهدايا.",
        presets: [
          "أجواء الصيف",
          "موسم العطلات",
          "العودة إلى المدرسة",
          "تجديد الربيع",
        ],
      },
      "image-to-video": {
        title: "صورة إلى فيديو",
        description:
          "ابدأ من صورة ملصقة أو مرفوعة، أو ثبّت الإطارات الأولى والأخيرة ليولّد الذكاء الاصطناعي الحركة بينهما فقط.",
        heroHeading: "حوّل صورة ثابتة إلى حركة دون فقدان الإطار الأصلي.",
        heroSubtext:
          "استخدم صورة منتج كإطار افتتاحي، أو ارفع إطاراً أول وآخر لاستبدال تحكمي.",
        firstFrameMode: "الإطار الأول",
        firstFrameModeDesc: "تحريك من صورة واحدة",
        firstLastMode: "أول + آخر",
        firstLastModeDesc: "ملء الفاصل",
        motionPlaceholderDual:
          "حركة كاميرا سلسة فاخرة تربط صورة المنتج الأولى بزاوية البطل النهية، مع مسح ضوئي خفيف وبدون تشويه للمنتج.",
        motionPlaceholderSingle:
          "تتقدم الكاميرا ببطء، يلمع التكاثف على الزجاجة، تتأرجح إضاءة الخلفية برفق، المنتج يبقى حاداً وواضحاً.",
      },
      "multi-shot-video": {
        title: "فيديو متعدد المشاهد",
        description: "اكتب موجزاً بسيطاً، احصل على فيديو متعدد المشاهد.",
        heroHeading: "فيديو متعدد المشاهد",
        heroSubtext: "اكتب موجزاً بسيطاً، احصل على فيديو متعدد المشاهد.",
        autoPlaceholder:
          "رائد فضاء وحيد يمشي عبر صحراء حمراء واسعة تحت وردي سماء. يتوقف، يركع، ويلتقط موضوعاً متوهجاً نصف مدفوع في الرمل. لقطة قريبة على وجهها وهي تنظر إلى الأعلى، تظهر هيكلاً ضخماً من الغبار على الأفق.",
        openingShot: "لقطة الافتتاح: الشخصية تدخل المشهد...",
        finalShot: "اللقطة الأخيرة: الكشف، المكافأة...",
        describeShot: "صف اللقطة {n}...",
      },
    },
    features: {
      "edit-studio": {
        title: "استوديو التحرير",
        description:
          "حوّل فيديو بتحريرات بسيطة للإضاءة والنمط والعناصر والإيقاع.",
      },
      "multi-shot-video": {
        title: "فيديو متعدد المشاهد",
        description: "اكتب موجزاً بسيطاً، احصل على فيديو متعدد المشاهد.",
      },
      "scene-builder": {
        title: "منشئ المشاهد",
        description:
          "صمّم مشهدك المتعدد الخطوات خطوة بخطوة، شاهد المظهر، ثم أحضره إلى الحياة.",
      },
      "upscale-video": {
        title: "تحسين الفيديو",
        description: "تحسين جودة الفيديو بـ Topaz AI.",
      },
      "performance-capture": {
        title: " التقاط الأداء بـ Act-Two",
        description: "حرّك الشخصيات باستخدام فيديوهات أداء قيادية.",
      },
      "remove-from-video": {
        title: "إزالة من الفيديو",
        description: "أزل العناصر بدون إعادة التصوير.",
      },
      "product-shot-video": {
        title: "منشئ فيديو لقطات المنتج",
        description: "حوّل صورة منتج إلى إعلان فيديو مصقول.",
      },
      "text-to-image": {
        title: "نص إلى صورة",
        description: "ولّد صوراً إعلانية جاهزة من وصف نصي.",
      },
      "image-editor": {
        title: "محرر صور بالذكاء الاصطناعي",
        description:
          "أعد التصميم أو الإضاءة أو التصوير أو غيّر الخلفيات من صورة مرجعية واحدة.",
      },
      "image-to-video": {
        title: "صورة إلى فيديو",
        description: "حرّك صورة واحدة أو اربط الإطارات الأولى والأخيرة.",
      },
      "expand-image": {
        title: "توسيع الصورة",
        description: "وسّع صورة تجاوز حدودها الأصلية.",
      },
      "stylize-image": {
        title: "تجميل الصورة",
        description:
          "طبّق أنماطاً فنية على صورتك -- ألوان مائية، زيت، أنمي، كلاسيكي، والمزيد.",
      },
      "product-reshoot": {
        title: "إعادة تصوير المنتج",
        description: "غيّر الإعداد أو الإضاءة أو الزاوية لصورة منتجك فوراً.",
      },
      "vary-image": {
        title: "تنويع الصورة",
        description:
          "ولّد تنويعات إبداعية لصورتك -- غيّر العناصر مع الحفاظ على التكوين الأساسي.",
      },
      mockup: {
        title: "مولّد الموك أب",
        description:
          "ضع تصميمك على منتجات حقيقية -- ملابس، أكواب، شاشات، لافتات.",
      },
      "create-ad": {
        title: "إنشاء إعلان",
        description:
          "ولّد إعلانات إبداعية من الصفر أو نسخاً متنوعة من إعلان موجود.",
      },
      "batch-social": {
        title: "مولّد السوشيال بالجملة",
        description:
          "ولّد أسبوعاً من منشورات السوشيال المخصصة للمنصات من فكرة واحدة.",
      },
      "carousel-builder": {
        title: "منشئ الكاروسيل",
        description: "أنشئ منشورات كاروسيل متعددة الشرائح لإنستغرام ولينكدإن.",
      },
      "hook-generator": {
        title: "مولّد الخطافات القصيرة",
        description: "ولّد تنويعات خطافات فيروسية لـ Reels وTikToks.",
      },
      "platform-resizer": {
        title: "مُعدّل المنصات",
        description: "كيّف أي صورة لأبعاد كل منصة سوشيال.",
      },
      "lesson-to-video": {
        title: "درس إلى فيديو",
        description: "حوّل خطة الدرس إلى فيديو تعليمي منظم مع مشاهد ومرئيات.",
      },
      "explainer-video": {
        title: "فيديو شرح",
        description: "أنشئ فيديوهات شرح خطوة بخطوة من وصف مفهوم.",
      },
      "whiteboard-animation": {
        title: "رسوم متحركة على السبورة",
        description: "ولّد فيديوهات تعليمية على نمط السبورة البيضاء من نص.",
      },
      "course-trailer": {
        title: "إعلان الدورة",
        description: "إنشاء إعلان جذاب للترويج لدورةك الإلكترونية.",
      },
      "style-transfer": {
        title: "نقل الأسلوب",
        description:
          "حوّل أي صورة إلى نمط فني جديد -- لوحة زيتية، أنمي، سايبربانك، والمزيد.",
      },
      "surreal-scene": {
        title: "منشئ المشاهد السريالية",
        description: "ولّد مشاهد أحلام مستحيلة من أوصاف نصية.",
      },
      "visual-remix": {
        title: "ريمكس بصري",
        description: "ارفع صورة وولّد نسخاً متنوعة بأساليب مختلفة.",
      },
      "loop-generator": {
        title: "مولّد الحلقات",
        description: "أنشئ فن بصري مثالي التكرار للخلفيات والسوشيال.",
      },
      "script-to-storyboard": {
        title: "نص إلى ستوري بورد",
        description: "الصق نصاً واحصل على ستوري بورد كامل مع تحليل المشاهد.",
      },
      "ab-variants": {
        title: "مولّد اختبار A/B",
        description: "ولّد نسخاً متنوعة من إعلان واحد للاختبار.",
      },
      "seasonal-transform": {
        title: "محوّل الحملات الموسمية",
        description: "حوّل إعلاناً موجوداً إلى نسخة موسمية تلقائياً.",
      },
      "text-to-speech": {
        title: "نص إلى كلام",
        description: "ولّد صوتاً منطوقاً من نص.",
      },
      "lip-sync": {
        title: "مزامنة الشفاه",
        description: "مزامنة الكلام مع شخصية أو أداء.",
      },
      "custom-agent": {
        title: "وكيل مخصص",
        description: "أنشئ مساعداً مخصصاً لسير عمل إبداعي قابل للتكرار.",
      },
      "model-library": {
        title: "مكتبة النماذج",
        description: "اختر نماذج التوليد وقارن بين القدرات.",
      },
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
