
import { AgentConfig, TriviaPost } from "../types";

// We assume FIREBASE_DB_URL is provided in the environment. 
// If not, we fall back to a safe mode.
const DB_URL = process.env.FIREBASE_DB_URL || "";

export interface ProjectData {
  config: AgentConfig;
  posts: TriviaPost[];
}

export async function saveProjectData(data: ProjectData): Promise<void> {
  if (!DB_URL) {
    console.warn("Firebase DB URL not configured. Saving only to local storage.");
    return;
  }

  try {
    const response = await fetch(`${DB_URL}/velotrivia.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to sync with Firebase");
  } catch (error) {
    console.error("Firebase Sync Error:", error);
    throw error;
  }
}

export async function loadProjectData(): Promise<ProjectData | null> {
  if (!DB_URL) return null;

  try {
    const response = await fetch(`${DB_URL}/velotrivia.json`);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Firebase Load Error:", error);
    return null;
  }
}
