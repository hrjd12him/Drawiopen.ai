type ShortcutCallback = (event: KeyboardEvent) => void;

export class KeyboardManager {
  private readonly shortcuts = new Map<string, ShortcutCallback>();
  private listening = false;

  public registerShortcut(
    keyCombination: string,
    callback: ShortcutCallback,
  ) {
    const normalized = normalizeShortcut(keyCombination);
    this.shortcuts.set(normalized, callback);

    return () => {
      this.shortcuts.delete(normalized);
    };
  }

  public start() {
    if (this.listening) {
      return;
    }

    window.addEventListener("keydown", this.handleKeyDown);
    this.listening = true;
  }

  public stop() {
    if (!this.listening) {
      return;
    }

    window.removeEventListener("keydown", this.handleKeyDown);
    this.listening = false;
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const shortcut = normalizeKeyboardEvent(event);
    const callback = this.shortcuts.get(shortcut);

    if (!callback) {
      return;
    }

    event.preventDefault();
    callback(event);
  };
}

function normalizeShortcut(keyCombination: string) {
  const parts = keyCombination
    .toLowerCase()
    .split("+")
    .map((part) => part.trim())
    .filter(Boolean);

  const key = parts.find(
    (part) => !["ctrl", "control", "meta", "cmd", "shift", "alt"].includes(part),
  );

  return [
    parts.some((part) => part === "ctrl" || part === "control") ? "ctrl" : null,
    parts.some((part) => part === "meta" || part === "cmd") ? "meta" : null,
    parts.includes("shift") ? "shift" : null,
    parts.includes("alt") ? "alt" : null,
    key ?? "",
  ]
    .filter(Boolean)
    .join("+");
}

function normalizeKeyboardEvent(event: KeyboardEvent) {
  return [
    event.ctrlKey ? "ctrl" : null,
    event.metaKey ? "meta" : null,
    event.shiftKey ? "shift" : null,
    event.altKey ? "alt" : null,
    event.key.toLowerCase(),
  ]
    .filter(Boolean)
    .join("+");
}
