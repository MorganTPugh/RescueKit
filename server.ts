import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Parse JSON request bodies
app.use(express.json({ limit: "15mb" }));

// Initialize the Gemini API client safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("GEMINI_API_KEY environment variable is not defined. AI bio generation will be disabled.");
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI client:", error);
}

// API Routes FIRST
app.post("/api/generate-bio", async (req, res) => {
  if (!ai) {
    return res.status(503).json({ 
      error: "AI Bio Generation is temporarily configured without an API Key. Please add your GEMINI_API_KEY in the Secrets panel." 
    });
  }

  const { pet, style, templateId } = req.body;
  if (!pet || !pet.name) {
    return res.status(400).json({ error: "Pet data, including pet name, is required." });
  }

  try {
    const selectedStyle = style || "playful";
    const isBioOnly = templateId === "bio-only";
    
    // Construct instructions based on selection
    let styleDescription = "";
    if (isBioOnly) {
      styleDescription = `
        - Tone: Adorable, comprehensive, highly informative and natural.
        - REQUIRED Layout Constraint: Since this is a "Biography Only" text view (for copy-pasting directly onto Petfinder, social media, or flyers), the story description MUST naturally weave in ALL core pet details and contact details so the narrative is completely self-contained without any separate sidebars, visual cards, or footer blocks.
        - You MUST integrate: Age (${pet.age}), Breed/Mix (${pet.breed}), Gender (${pet.gender === 'girl' ? 'female' : pet.gender === 'boy' ? 'male' : 'companion'}), Weight or Size (${pet.weight}), and Location (${pet.location}).
        - You MUST also naturally weave in their compatibility facts: House trained status (${pet.houseTrained}), and friendly compatibility with Dogs (${pet.goodWithDogs}), Cats (${pet.goodWithCats}), and Kids (${pet.goodWithKids}).
        - You MUST naturally conclude the narrative with contact/rescue information integrated directly into the final sentences of the text. Include:
          * Rescue organization name: ${pet.rescueOrg || 'Independent Rescuer'}
          * ${pet.fosterEmail ? `Contact Email: ${pet.fosterEmail}` : ""}
          * ${pet.fosterPhone ? `Contact Phone: ${pet.fosterPhone}` : ""}
          * ${pet.rescueWebsite ? `More information website: ${pet.rescueWebsite}` : ""}
        - Combine all of these personality elements, facts, and contact details into a cohesive, beautifully written biography flow that excels as a ready-to-use adoption listing!
      `;
    } else if (selectedStyle === "tinder") {
      styleDescription = `
        - Tone: Humorous, charming, lighthearted, and playful. Structured like a cute "Tinder-style" dating profile for a pet.
        - Include sections like 'About Me', 'My Dream Sunday', 'Negotiable Perks', 'Absolute Red Flags' (keep them extremely funny, e.g. "Will scream for cheese").
        - Keep the emojis cheerful and relevant.
      `;
    } else if (selectedStyle === "heartwarming") {
      styleDescription = `
        - Tone: Touchingly sweet, caring, and deeply heartwarming. Focuses on tender loyalty and bonding.
        - Emphasize how their cute habits (and any fears they might have) make them beautiful. Ideally narrates their personality like a sweet guardian/loyal friend looking for safety.
        - Standard paragraph narrative, warm and emotional but not overly tragic.
      `;
    } else {
      // scroll-stopper social
      styleDescription = `
        - Tone: Punchy, high-energy, scrolls-stopping social media caption!
        - Use excellent spacing, lots of cute pet-centric emojis, short paragraphs, and catchphrases.
        - End with highly visible, playful hashtags (e.g. #FosterHero, #[breed], #AdoptDontShop).
      `;
    }

    const prompt = `
      Create a highly attractive, cute, and engaging foster pet adoption bio for a public poster.
      Here are the survey details provided by their foster parent:
      
      - Pet Name: ${pet.name}
      - Species: ${pet.species} ${pet.customSpecies ? `(${pet.customSpecies})` : ""}
      - Breed: ${pet.breed}
      - Age: ${pet.age}
      - Gender: ${pet.gender}
      - Weight: ${pet.weight}
      - Character Tags: ${pet.traits.join(", ")}
      
      Living Compatibility Answers:
      - Good with dogs? ${pet.goodWithDogs}
      - Good with cats? ${pet.goodWithCats}
      - Good with kids? ${pet.goodWithKids}
      - House trained? ${pet.houseTrained}
      
      Special Personal Foster Questionnaire Insights:
      - Raw Story Notes / Draft / Outline: ${pet.estimatedBio || "Not specified by foster parent."}
      - Favorite activity/toy: ${pet.favoriteActivity || ""}
      - Funniest habit: ${pet.funnyHabit || ""}
      - Perfect day idea: ${pet.perfectDay || ""}
      - Love language (How they show love): ${pet.loveLanguage || ""}

      Requested Style:
      ${styleDescription}

      IMPORTANT RULES:
      1. Write from the prospective pet's point of view OR as an affectionate foster parent. Keep it in first-person (e.g. "I'm ${pet.name}!") or direct, warm storytelling.
      2. STRICT LENGTH LIMIT — count your words carefully before responding:
         - Standard poster templates: MAXIMUM 90 words. Do not exceed this. Short, punchy, impactful.
         - 'Biography Only' mode: MAXIMUM 180 words. You may use slightly more detail since the whole poster is text.
      3. Focus entirely on highlighting their unique quirks as endearing benefits.
      4. DO NOT use placeholder text or metadata tags. Keep the tone completely natural, adorable, and ready to print.
      5. If you are unsure whether you are under the word limit, cut more — shorter is always better on a printed poster.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const bioText = response.text || "";
    res.json({ bio: bioText.trim() });
  } catch (err: any) {
    console.error("Gemini API biological storytelling generation error:", err);
    res.status(500).json({ error: "Failed to generate bio with Gemini API: " + err.message });
  }
});

// Build Resend client if API key is configured
function createResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

app.post("/api/feedback", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message content is required." });
  }

  try {
    const feedbackPath = path.join(process.cwd(), "feedback_submissions.json");
    let currentFeedback = [];
    if (fs.existsSync(feedbackPath)) {
      try {
        const raw = fs.readFileSync(feedbackPath, "utf-8");
        currentFeedback = JSON.parse(raw);
        if (!Array.isArray(currentFeedback)) {
          currentFeedback = [];
        }
      } catch (e) {
        currentFeedback = [];
      }
    }

    const payload = {
      id: "feed_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      name: name || "Anonymous User",
      email: email || "No reply-to provided",
      subject: subject || "RescueKit Feedback",
      message: message,
      sentTo: "RescueKit2@proton.me",
      timestamp: new Date().toISOString()
    };

    currentFeedback.push(payload);
    fs.writeFileSync(feedbackPath, JSON.stringify(currentFeedback, null, 2), "utf-8");

    console.log("========================================");
    console.log("📬 NEW FEEDBACK RECEIVED");
    console.log(`From: ${payload.name} <${payload.email}>`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Message: ${payload.message}`);
    console.log("========================================");

    // Attempt to send email via Resend if API key is configured
    const resend = createResendClient();
    if (resend) {
      await resend.emails.send({
        from: "RescueKit Feedback <onboarding@resend.dev>",
        to: "morgantpugh3@gmail.com",
        reply_to: email ? `${name || "Anonymous"} <${email}>` : undefined,
        subject: `[RescueKit Feedback] ${payload.subject}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
        html: `<p><strong>From:</strong> ${payload.name} (${payload.email})</p><p><strong>Subject:</strong> ${payload.subject}</p><hr/><p>${payload.message.replace(/\n/g, "<br/>")}</p>`,
      });
      console.log("✅ Feedback email sent to RescueKit2@proton.me via Resend");
    } else {
      console.warn("⚠️  Resend not configured — feedback saved to file but not emailed. Add RESEND_API_KEY to .env to enable email delivery.");
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("Failed to process feedback submission:", err);
    res.status(500).json({ error: "Failed to process feedback submission: " + err.message });
  }
});

// Configure Vite middleware in development or express static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
