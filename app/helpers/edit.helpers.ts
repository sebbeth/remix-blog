import { Navigation } from "@remix-run/router";

export function getSaveButtonText(navigation: Navigation) {
    if (navigation.state === "submitting") {
      return "Saving...";
    }
    return "Save";
  }