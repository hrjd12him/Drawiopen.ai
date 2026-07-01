export interface ToolbarButtonConfig {
  id: string;
  label: string;
  title: string;
  onClick(id: string): void;
}

export class ToolbarButton {
  public readonly element: HTMLButtonElement;

  constructor(config: ToolbarButtonConfig) {
    this.element = document.createElement("button");
    this.element.type = "button";
    this.element.className = "toolbar-button";
    this.element.textContent = config.label;
    this.element.title = config.title;
    this.element.setAttribute("aria-label", config.title);
    this.element.addEventListener("click", () => config.onClick(config.id));
  }

  public setActive(active: boolean) {
    this.element.classList.toggle("toolbar-button--active", active);
    this.element.setAttribute("aria-pressed", String(active));
  }
}
